// import _ from 'lodash'
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
import { getIPAddress, getKeyword, validateKeyword } from 'utils/helper.util'

export const getCrosswordHandler = (req: Request, res: Response): void => {
  const puzzleId = getKeyword(req)

  if (!validateKeyword(puzzleId, dansSurprise.id)) {
    res.status(403).send({ error: 'You are not yet authorized to access this resource.' })
    return
  }

  res.status(200).send({ crosswordTemplate, clueMap, acrossClues, downClues })
}

export const postCrosswordHandler = (req: Request, res: Response): void => {
  const puzzleId = getKeyword(req)
  const { solution: attempt } = req.body

  console.log(`${getIPAddress(req.socket.remoteAddress)}: ${attempt}`)

  if (!validateKeyword(puzzleId, dansSurprise.id)) {
    res.status(403).send({ error: 'You are not yet authorized to access this resource.' })
    return
  }

  if (attempt !== crosswordEncoding) {
    res.status(400).send({ correct: false })
    return
  }

  res.status(200).send({ correct: solution })
}
