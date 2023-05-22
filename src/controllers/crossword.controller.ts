import _ from 'lodash'
import { type Response, type Request } from 'express'
import { dansSurprise } from 'constants/puzzle'
import {
  crosswordTemplate,
  clueMap,
  acrossClues,
  downClues,
  crosswordEncoding,
  solution,
} from 'constants/crossword'
import { validateCookie } from 'utils/helper.util'

export const getCrosswordHandler = (req: Request, res: Response): void => {
  const cookie = _.get(req.cookies, 'marcos-22nd')

  if (!validateCookie(cookie, dansSurprise.id)) {
    res.status(403).send({ error: 'You are not yet authorized to access this resource.' })
    return
  }

  res.status(200).send({ crosswordTemplate, clueMap, acrossClues, downClues })
}

export const postCrosswordHandler = (req: Request, res: Response): void => {
  const cookie = _.get(req.cookies, 'marcos-22nd')
  const { solution: attempt } = req.body

  console.log(attempt)

  if (!validateCookie(cookie, dansSurprise.id)) {
    res.status(403).send({ error: 'You are not yet authorized to access this resource.' })
    return
  }

  if (attempt !== crosswordEncoding) {
    res.status(400).send({ correct: false })
    return
  }

  res.status(200).send({ correct: solution })
}
