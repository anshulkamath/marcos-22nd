import _ from 'lodash'
import { type Response, type Request } from 'express'
import { MAX_ROUNDS, SCORE_THRESH } from 'constants/revb'
import { validateCookie } from 'utils/helper.util'
import { idToPuzzle, keywords } from 'constants/puzzle'

export const postRevbHandler = (req: Request, res: Response): void => {
  const { score, round } = req.body
  const id = _.get(req, 'headers.authorization', keywords[0])
  const keyword = _.get(idToPuzzle, 'revb.keyword')

  if (!validateCookie(id, 'revb')) {
    res.status(403).send({ error: 'You are not yet authorized to access this resource.' })
    return
  }

  if (round === MAX_ROUNDS + 1 && score >= SCORE_THRESH) {
    res.status(200).send({ complete: true, keyword })
    return
  }

  res.status(200).send({ complete: false, keyword: null })
}
