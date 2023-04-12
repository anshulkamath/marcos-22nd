import _ from 'lodash'
import { type Request, type Response } from 'express'
import { GET_PUZZLE_NAMES_QUERY } from '../constants/api'
import { keywords, puzzleInfo, puzzleNames } from '../constants/puzzle'
import { getPlaylist, calculateScore } from '../spotify-minigame'
import { catchError } from './utils'

export const getPuzzleMetadataHandler = (req: Request, res: Response): void => {
  const { authorization: puzzleId } = req.headers
  const puzzleIndex = keywords.indexOf(puzzleId as string)

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
  const { authorization: puzzleId } = req.headers

  if (field === GET_PUZZLE_NAMES_QUERY) {
    res.status(200).send(puzzleNames)
    return
  }

  console.log(`Attempting to get puzzle ${puzzleId}`)
  res.status(200).send({
    message: `The given puzzle id was ${puzzleId}`,
  })
}

export const postPuzzleHandler = (req: Request, res: Response): void => {
  const { authorization: puzzleId } = req.headers
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

export const getSpotifySong = async (req: Request, res: Response): Promise<void> => {
  try {
    const playlistId: any = req.query.playlistId ?? undefined
    const [playlist] = await getPlaylist(playlistId)
    const chosenSong = _.sample(playlist)

    res.status(200).send({
      preview_url: chosenSong?.preview_url,
      id: chosenSong?.id,
    })
  } catch (e: unknown) {
    catchError(e, (e) => {
      res.status(400).send({
        error: e.message,
      })
    })
  }
}

export const postSpotifySong = async (req: Request, res: Response): Promise<void> => {
  const { name, date, id, level } = req.body

  try {
    const scoreResponse = await calculateScore({ name, date, id, level })

    res.status(200).send(scoreResponse)
  } catch (e) {
    catchError(e, (e) => {
      res.status(400).send({
        error: e.message,
      })
    })
  }
}

export const getRSAPuzzleHandler = (req: Request, res: Response): void => {
  try {
    res.setHeader('Authorization', '0x314fb9')
    res.status(200).send({
      link: process.env.RSA_PRESENTATION_LINK,
      N: '0x776b91',
      encryptedMessage: '0x4e8f84',
    })
  } catch (e) {
    catchError(e, (e) => {
      res.status(400).send({
        error: e.message,
      })
    })
  }
}

export const postRSAPuzzleHandler = (req: Request, res: Response): void => {
  const { authorization: privateKey } = req.headers
  const { solution } = req.body

  const errors: string[] = []
  try {
    if (privateKey === undefined) {
      errors.push('Error: No `Authorization` header was passed. Unable to verify private key.')
      res.status(400).send({ error: true, message: errors })
      return
    }

    if (privateKey !== '0x1ba2c1') {
      errors.push('Error: The wrong private key was given.')
    }

    if (solution === undefined) {
      errors.push('Error: No solution field was given to the solution')
    } else if (solution !== 'pog') {
      errors.push('Error: The decrypted message was not correct.')
    }

    if (errors.length) {
      res.status(400).send({
        error: true,
        message: errors.length === 1 ? errors[0] : errors,
      })

      return
    }

    res.status(200).send({
      error: false,
      solution: 'who me?',
    })
  } catch (e) {
    catchError(e, (e) => {
      res.status(400).send({
        error: e.message,
      })
    })
  }
}
