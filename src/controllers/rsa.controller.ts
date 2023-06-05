import _ from 'lodash'
import { type Request, type Response } from 'express'
import { catchError } from '../utils/error.util'
import { getIPAddress } from 'utils/helper.util'
import { publicKey, privateKey, n, encryptedMessage, solution } from 'constants/rsa'

export const getRSAPuzzleHandler = (req: Request, res: Response): void => {
  try {
    res.setHeader('Authorization', publicKey)
    res.status(200).send({
      n,
      encryptedMessage,
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
  const d = _.get(req, 'headers.authorization', '').match(/0x[0-9a-fA-F]+/)?.input ?? ''
  const { solution: guess } = req.body

  const errors: string[] = []
  try {
    if (d === undefined) {
      errors.push('Error: No `Authorization` header was passed. Unable to verify private key.')
      res.status(400).send({ error: true, message: errors[0] })
      return
    }

    console.log(
      `${getIPAddress(
        req.socket.remoteAddress,
      )}: attempted to solve with private key '${d}' and solution ${guess}`,
    )

    if (d !== privateKey) {
      errors.push('Error: The wrong private key was given.')
    }

    if (guess === undefined) {
      errors.push('Error: No `solution` field was given to the solution')
    } else if (guess !== solution) {
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
      keyword: 'who me?',
    })
  } catch (e) {
    catchError(e, (e) => {
      res.status(400).send({
        error: e.message,
      })
    })
  }
}
