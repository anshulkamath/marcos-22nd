import { type NextFunction, type Request, type Response } from 'express'
import { scavengerHuntData } from 'constants/riddle'

const getScavengerHuntHandler =
  (riddle: string) =>
  (req: Request, res: Response): void => {
    res.status(200).render('frosh-puzzle', { riddle })
  }

export const scavengerHuntMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const { app } = req

  scavengerHuntData.forEach(({ resource, riddle }) => {
    app.get(`/${resource}`, getScavengerHuntHandler(riddle))
  })

  next()
}
