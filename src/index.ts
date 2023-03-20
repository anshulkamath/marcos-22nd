/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'

import { getPuzzleHandler } from './logic/handler'

const app = express()
const port = process.env.PORT ?? 8080

app.get('/puzzle', getPuzzleHandler)

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
