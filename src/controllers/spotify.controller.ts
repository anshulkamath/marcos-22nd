import _ from 'lodash'
import { type Request, type Response } from 'express'
import { getPlaylist, calculateScore } from 'spotify-minigame'
import { finale, idToPuzzle } from 'constants/puzzle'
import { MAX_ROUNDS } from 'constants/spotify'
import { catchError } from 'utils/error.util'

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
  const { name, date, id, level, round } = req.body

  const spotifyPuzzle = _.get(idToPuzzle, 'spotify', undefined)

  if (!spotifyPuzzle) {
    res.status(500).send({
      message: 'Internal server error. Unable to find puzzle.',
    })
    return
  }

  try {
    const scoreResponse = await calculateScore({ name, date, id, level })

    res.status(200).send({
      ...scoreResponse,
      terminated: round === MAX_ROUNDS ? finale : false,
    })
  } catch (e) {
    catchError(e, (e) => {
      res.status(400).send({
        error: e.message,
      })
    })
  }
}
