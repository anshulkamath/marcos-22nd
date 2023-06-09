import { type NextFunction, type Request, type Response } from 'express'
import { scavengerHuntData } from 'constants/riddle'
import { getIPAddress } from 'utils/helper.util'

const getScavengerHuntHandler =
  (riddle: string) =>
  (req: Request, res: Response): void => {
    console.log(`${getIPAddress(req.socket.remoteAddress)} getting frosh puzzle: ${riddle}`)
    res.status(200).render('frosh-puzzle', { riddle })
  }

export const scavengerHuntMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const { app } = req

  scavengerHuntData.forEach(({ resource, riddle }) => {
    app.get(`/scavenger-hunt/${resource}`, getScavengerHuntHandler(riddle))
  })

  app.get(
    '/scavenger-hunt/*',
    getScavengerHuntHandler('Why was that answer so bad? Go back and try again.'),
  )

  next()
}
