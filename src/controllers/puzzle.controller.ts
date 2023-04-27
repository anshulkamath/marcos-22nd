import _ from 'lodash'
import { type Request, type Response } from 'express'
import path from 'path'
import { GET_PUZZLE_NAMES_QUERY } from '../constants/api'
import { finale, keywords, puzzleInfo, puzzleNames } from '../constants/puzzle'

export const getPuzzleMetadataHandler = (req: Request, res: Response): void => {
  const puzzleId = _.get(req.cookies, 'marcos-22nd')
  const puzzleIndex = keywords.indexOf(puzzleId as string)

  if (puzzleId === finale.keyword) {
    res.status(200).send({ puzzleInfo })
    return
  }

  if (puzzleIndex === -1) {
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
  const { field } = req.query
  const puzzleId = _.get(req.cookies, 'marcos-22nd')
  const { day } = req.query

  if (field === GET_PUZZLE_NAMES_QUERY) {
    res.status(200).send(puzzleNames)
    return
  }

  if (!puzzleId) {
    res.status(400).send({
      message: 'Puzzle id was not given.',
    })
    return
  }

  const puzzleIndex = Number.parseInt(day as string)
  if (puzzleIndex < 0 || puzzleIndex > keywords.indexOf(puzzleId) + 1) {
    res.status(400).send({
      message: 'Incorrect puzzle id given',
    })
    return
  }

  const { resourceName } = puzzleInfo[puzzleIndex]
  if (!resourceName) {
    res.status(500).send({
      message: 'Resource unavailable. Please try again later.',
    })
    return
  }

  const resourceDir = path.join(__dirname, '..', 'puzzle-packages', resourceName)
  console.log(`Attempting to get puzzle ${puzzleId} located at ${resourceDir}`)
  res.status(200).download(resourceDir, (err) => {
    if (err) {
      console.error(`There was an error downloading the requested files: ${err}`)
      return
    }

    console.log(`Successfully got resource ${resourceDir}`)
  })
}

export const postPuzzleHandler = (req: Request, res: Response): void => {
  const puzzleId = _.get(req.cookies, 'marcos-22nd')
  const { keyword: guess } = req.body
  const keywordIdx = keywords.indexOf(puzzleId as string)

  if (keywords.indexOf(guess) !== keywordIdx + 1) {
    res.status(400).send({
      message: puzzleInfo[keywordIdx + 1].failureMessage,
    })
    return
  }

  res.status(200).send({
    message: puzzleInfo[keywordIdx + 1].successMessage,
  })
}
