import _ from 'lodash'

import { COOKIE_KEY } from 'constants/api'
import {
  finale,
  idToPuzzle,
  keywords,
  mysteryPuzzle,
  revbPuzzle,
  memoryLanePuzzle,
  homeResource,
} from 'constants/puzzle'
import { type Request, type Response } from 'express'

export const getViewHandler =
  (view: string, puzzleId: string, calcOptions?: (req: Request) => object) =>
  (req: Request, res: Response): void => {
    const cookie = _.get(req.cookies, COOKIE_KEY)
    const expectedKeyword = idToPuzzle[puzzleId].keyword

    if (keywords.indexOf(cookie) < keywords.indexOf(expectedKeyword) - 1) {
      res.status(403).render('403', { path: req.originalUrl })
      return
    }

    res.status(200).render(view, calcOptions ? calcOptions(req) : undefined)
  }

export const getHomeViewHandler = (req: Request, res: Response): void => {
  const cookieExpiration = 30 * 24 * 60 * 60
  const cookie = _.get(req.cookies, COOKIE_KEY)
  res.cookie(COOKIE_KEY, cookie ?? keywords[0], { maxAge: cookieExpiration })

  res.status(200).render(homeResource, {
    unlocked: cookie === finale.keyword,
  })
}

export const getRSAViewHandler = getViewHandler(mysteryPuzzle.template!, mysteryPuzzle.id)
export const getRevbViewHandler = getViewHandler(revbPuzzle.template!, revbPuzzle.id)
export const getMemoryLaneViewHandler = getViewHandler(
  memoryLanePuzzle.template!,
  memoryLanePuzzle.id,
)

export const getCongratsViewHandler = (req: Request, res: Response): void => {
  const key = _.get(req.cookies, COOKIE_KEY)

  if (key !== finale.keyword) {
    res.status(403).render('403', { path: req.originalUrl })
    return
  }

  res.status(200).render('marcos-bday', { redirect: finale.redirect })
}
