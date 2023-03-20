import _ from 'lodash'
import { type Request, type Response } from 'express'
import { getPlaylist, calculateScore } from '../spotify-minigame'
import { catchError } from './utils'

export const getPuzzleHandler = (req: Request, res: Response): void => {
  const { id: puzzleId } = req.query
  console.log(puzzleId)

  res.status(200).send({
    message: `The given puzzle id was ${puzzleId}`,
  })
}

export const getSpotifySong = async (req: Request, res: Response): Promise<void> => {
  try {
    const [playlist] = await getPlaylist()
    res.status(200).send({
      preview_url: _.sample(playlist)?.preview_url,
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
  const { name, date, id } = req.body

  try {
    const scoreResponse = await calculateScore({ name, date, id })

    res.status(200).send(scoreResponse)
  } catch (e) {
    catchError(e, (e) => {
      res.status(400).send({
        error: e.message,
      })  
    })
  }
}
