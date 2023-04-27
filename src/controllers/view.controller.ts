import _ from 'lodash'

import { COOKIE_KEY } from 'constants/api'
import { finale, keywords } from 'constants/puzzle'
import { type Request, type Response } from 'express'

export const getViewHandler =
  (view: string, calcOptions?: (req: Request) => object) =>
  (req: Request, res: Response): void => {
    res.render(view, calcOptions ? calcOptions(req) : undefined)
  }

export const getHomeViewHandler = (req: Request, res: Response): void => {
  console.log(req.cookies)
  const cookieExpiration = 30 * 24 * 60 * 60
  if (!_.has(req.cookies, COOKIE_KEY)) {
    res.cookie(COOKIE_KEY, keywords[0], { maxAge: cookieExpiration })
  }

  res.render('index.ejs', {
    unlocked: req.headers.authorization === finale.keyword,
  })
}

export const getRSAViewHandler = getViewHandler('mystery.ejs')
export const getRevbViewHandler = getViewHandler('revb.ejs')
export const getMemoryLaneViewHandler = getViewHandler('memory-lane.ejs')

export const getCongratsViewHandler = (req: Request, res: Response): void => {
  const { key } = req.query

  if (key !== finale.keyword) {
    res.render('404', { path: req.originalUrl })
    return
  }

  res.render('marcos-bday.ejs', { redirect: finale.redirect })
}
