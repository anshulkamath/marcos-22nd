import { type Request, type Response } from 'express'
import { catchError } from '../utils/error.util'

export const getRSAPuzzleHandler = (req: Request, res: Response): void => {
  try {
    res.setHeader('Authorization', '0x314fb9')
    res.status(200).send({
      link: process.env.RSA_PRESENTATION_LINK,
      N: '0x776b91',
      encryptedMessage: '0x4e8f84',
    })
  } catch (e) {
    catchError(e, (e) => {
      res.status(400).send({
        error: e.message,
      })
    })
  }
}

export const postRSAPuzzleHandler = (req: Request, res: Response): void => {
  const { authorization: privateKey } = req.headers
  const { solution } = req.body

  const errors: string[] = []
  try {
    if (privateKey === undefined) {
      errors.push('Error: No `Authorization` header was passed. Unable to verify private key.')
      res.status(400).send({ error: true, message: errors[0] })
      return
    }

    if (privateKey !== '0x1ba2c1') {
      errors.push('Error: The wrong private key was given.')
    }

    if (solution === undefined) {
      errors.push('Error: No solution field was given to the solution')
    } else if (solution !== 'pog') {
      errors.push('Error: The decrypted message was not correct.')
    }

    if (errors.length) {
      res.status(400).send({
        error: true,
        message: errors.length === 1 ? errors[0] : errors,
      })

      return
    }

    res.status(200).send({
      error: false,
      solution: 'who me?',
    })
  } catch (e) {
    catchError(e, (e) => {
      res.status(400).send({
        error: e.message,
      })
    })
  }
}
