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
    const playlistId: any = req.query.playlistId || undefined
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
