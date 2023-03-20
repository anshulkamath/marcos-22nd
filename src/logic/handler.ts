import _ from 'lodash'
import { type Request, type Response } from 'express'
import { getPlaylist } from '../spotify-minigame'

export const getPuzzleHandler = (req: Request, res: Response): void => {
  const { id: puzzleId } = req.query
  console.log(puzzleId)

  res.status(200).send({
    message: `The given puzzle id was ${puzzleId}`,
  })
}

export const getSpotifySong = async (req: Request, res: Response): Promise<void> => {
  const playlist = await getPlaylist()
  res.status(200).send({
    preview_url: _.sample(playlist)?.preview_url,
  })
}
