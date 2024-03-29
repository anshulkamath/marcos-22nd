import _ from 'lodash'
import { type Request, type Response } from 'express'
import path from 'path'
import { COOKIE_AGE, COOKIE_KEY, GET_PUZZLE_NAMES_QUERY } from '../constants/api'
import { finale, keywords, puzzleInfo, puzzleNames } from '../constants/puzzle'
import { getIPAddress, getKeyword } from 'utils/helper.util'

export const getPuzzleMetadataHandler = (req: Request, res: Response): void => {
  const keyword = getKeyword(req)
  const puzzleIndex = keywords.indexOf(keyword)

  console.log(
    `${getIPAddress(
      req.socket.remoteAddress ?? '??',
    )} attempting to fetch metadata using keyword '${keyword}'`,
  )

  if (keyword === finale.keyword) {
    res.status(200).send({ puzzleInfo })
    return
  }

  if (puzzleIndex === -1) {
    console.error(`${getIPAddress(req.socket.remoteAddress)} gave an invalid keyword: ${keyword}`)
    res.status(400).send({
      error: 'An invalid keyword was given',
    })
    return
  }

  res.status(200).send({
    puzzleInfo: puzzleInfo.slice(0, puzzleIndex + 2).map((elem) => _.omit(elem, ['keyword'])),
  })
}

export const getPuzzleHandler = (req: Request, res: Response): void => {
  const keyword = getKeyword(req)
  const { field } = req.query
  const { day } = req.query

  if (field === GET_PUZZLE_NAMES_QUERY) {
    res.status(200).send(puzzleNames)
    return
  }

  if (!keyword) {
    console.error(`${getIPAddress(req.socket.remoteAddress)} did not give puzzle id`)
    res.status(400).send({
      message: 'Puzzle id was not given.',
    })
    return
  }

  const puzzleIndex = Number.parseInt(day as string)
  if (puzzleIndex < 0 || puzzleIndex > keywords.indexOf(keyword) + 1) {
    console.error(`Incorrect puzzle id given: ${keyword}`)
    res.status(400).send({
      message: 'Incorrect puzzle id given',
    })
    return
  }

  const { resourceName } = puzzleInfo[puzzleIndex]
  if (!resourceName) {
    console.error(`Failed to get resource ${resourceName}`)
    res.status(500).send({
      message: 'Resource unavailable. Please try again later.',
    })
    return
  }

  const resourceDir = path.join(__dirname, '..', 'puzzle-packages', resourceName)
  console.log(
    `${getIPAddress(
      req.socket.remoteAddress ?? '??',
    )} attempting to get puzzle ${keyword} located at ${resourceDir}`,
  )
  res.status(200).download(resourceDir, (err) => {
    if (err) {
      console.error(
        `${getIPAddress(
          req.socket.remoteAddress ?? '??',
        )} had was an error downloading the requested files: ${err}`,
      )
      return
    }

    console.log(
      `${getIPAddress(req.socket.remoteAddress)} successfully got resource ${resourceDir}`,
    )
  })
}

export const postPuzzleHandler = (req: Request, res: Response): void => {
  const keyword = getKeyword(req)
  const { keyword: guess } = req.body
  const keywordIdx = keywords.indexOf(keyword)

  if (keywords.indexOf(guess) !== keywordIdx + 1) {
    console.log(
      `${getIPAddress(req.socket.remoteAddress)} submitted the wrong keyword guess: ${guess}`,
    )
    res.status(400).send({
      message: puzzleInfo[keywordIdx + 1].failureMessage,
    })
    return
  }

  console.log(
    `${getIPAddress(req.socket.remoteAddress ?? '??')} has solved puzzle ${keywordIdx + 1}!`,
  )

  res.cookie(COOKIE_KEY, guess, { maxAge: COOKIE_AGE })

  res.status(200).send({
    message: puzzleInfo[keywordIdx + 1].successMessage,
  })
}

export const updateCookieHandler = (req: Request, res: Response): void => {
  const keyword = getKeyword(req)
  const current = _.get(req, 'headers.authorization')

  if (!current) {
    res.status(400).send('Did not have keyword in authorization header to update with')
    return
  }

  res.status(200)

  if (keywords.indexOf(current) > keywords.indexOf(keyword)) {
    res.cookie(COOKIE_KEY, current, { maxAge: COOKIE_AGE })
    res.status(201)
  }

  res.send()
}
