import _ from 'lodash'

import { DEBUG_MODE, ENDPOINT } from 'constants/api'
import {
  finale,
  idToPuzzle,
  keywords,
  mysteryPuzzle,
  revbPuzzle,
  memoryLanePuzzle,
  homeResource,
  dansSurprise,
} from 'constants/puzzle'
import { type Request, type Response } from 'express'

export const getViewHandler =
  (view: string, puzzleId: string, calcOptions?: (req: Request) => object) =>
  (req: Request, res: Response): void => {
    const id = _.get(req, 'query.keyword', keywords[0]) as string
    const expectedKeyword = idToPuzzle[puzzleId].keyword

    if (keywords.indexOf(id) < keywords.indexOf(expectedKeyword) - 1) {
      res.status(403).render('403', { path: req.originalUrl })
      return
    }

    const options = calcOptions ? calcOptions(req) : {}

    res.status(200).render(view, { endpoint: ENDPOINT, ...options })
  }

export const getHomeViewHandler = (req: Request, res: Response): void => {
  const puzzleId = _.get(req, 'query.keyword', keywords[0])

  res.status(200).render(homeResource, {
    endpoint: ENDPOINT,
    unlocked: puzzleId === finale.keyword,
    debug_mode: DEBUG_MODE,
  })
}

export const getDanViewHandler = getViewHandler(dansSurprise.template!, dansSurprise.id)
export const getRSAViewHandler = getViewHandler(mysteryPuzzle.template!, mysteryPuzzle.id)
export const getRevbViewHandler = getViewHandler(revbPuzzle.template!, revbPuzzle.id)
export const getMemoryLaneViewHandler = getViewHandler(
  memoryLanePuzzle.template!,
  memoryLanePuzzle.id,
)

export const getCongratsViewHandler = (req: Request, res: Response): void => {
  const key = _.get(req, 'query.keyword', keywords[0])

  if (key !== finale.keyword) {
    res.status(403).render('403', { path: req.originalUrl })
    return
  }

  res.status(200).render('marcos-bday', { redirect: finale.redirect })
}
