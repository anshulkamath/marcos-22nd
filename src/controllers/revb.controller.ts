import _ from 'lodash'
import { type Response, type Request } from 'express'
import { MAX_ROUNDS, SCORE_THRESH } from 'constants/revb'
import { validateCookie } from 'utils/auth.util'
import { idToPuzzle } from 'constants/puzzle'

export const postRevbHandler = (req: Request, res: Response): void => {
  const { score, round } = req.body
  const cookie = _.get(req.cookies, 'marcos-22nd')
  const keyword = _.get(idToPuzzle, 'revb.keyword')

  if (!validateCookie(cookie, 'revb')) {
    res.status(403).send({ error: 'You are not yet authorized to access this resource.' })
    return
  }

  if (round === MAX_ROUNDS + 1 && score >= SCORE_THRESH) {
    res.status(200).send({ complete: true, keyword })
    return
  }

  res.status(200).send({ complete: false, keyword: null })
}
