import { exec } from 'child_process'
import { type Request, type Response } from 'express'
import fs from 'fs'

import { CONGRATS_SCRIPT, DEBUG_MODE, ENDPOINT_URL } from 'constants/api'
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
import { getIPAddress, getKeyword } from 'utils/helper.util'

export const getViewHandler =
  (view: string, puzzleId: string, options?: any) =>
  (req: Request, res: Response): void => {
    const id = getKeyword(req)
    const expectedKeyword = idToPuzzle[puzzleId].keyword

    if (keywords.indexOf(id) < keywords.indexOf(expectedKeyword) - 1) {
      console.log(
        `${getIPAddress(
          req.socket.remoteAddress,
        )} unauthorized to access page ${expectedKeyword} with keyword: '${id}'`,
      )
      res.status(403).render('403', { path: req.originalUrl })
      return
    }

    console.log(`${getIPAddress(req.socket.remoteAddress)} successfully getting page '${id}'`)
    res.status(200).render(view, { endpoint: ENDPOINT_URL, ...options })
  }

export const getHomeViewHandler = (req: Request, res: Response): void => {
  const puzzleId = getKeyword(req)

  res.status(200).render(homeResource, {
    endpoint: ENDPOINT_URL,
    unlocked: puzzleId === finale.keyword,
    debug_mode: DEBUG_MODE,
  })
}

export const getDanViewHandler = getViewHandler(dansSurprise.template!, dansSurprise.id)
export const getRSAViewHandler = getViewHandler(mysteryPuzzle.template!, mysteryPuzzle.id, {
  link: process.env.RSA_PRESENTATION_LINK,
})
export const getRevbViewHandler = getViewHandler(revbPuzzle.template!, revbPuzzle.id)
export const getMemoryLaneViewHandler = getViewHandler(
  memoryLanePuzzle.template!,
  memoryLanePuzzle.id,
)

export const getFroshSurpriseHandler = (req: Request, res: Response): void => {
  res.redirect('/scavenger-hunt/start')
}

export const getCongratsViewHandler = (req: Request, res: Response): void => {
  const key = getKeyword(req)

  if (key !== finale.keyword) {
    res.status(403).render('403', { path: req.originalUrl })
    return
  }

  if (!DEBUG_MODE && CONGRATS_SCRIPT && fs.existsSync(CONGRATS_SCRIPT)) {
    exec(`source ${CONGRATS_SCRIPT}`)
    fs.rmSync(CONGRATS_SCRIPT)
  }

  res.status(200).render('marcos-bday', { redirect: finale.redirect })
}
