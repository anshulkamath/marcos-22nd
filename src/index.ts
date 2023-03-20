/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import bodyParser from 'body-parser'

import { getPuzzleHandler, getSpotifySong, postSpotifySong } from './logic/handler'

const app = express()
const port = process.env.PORT ?? 8080

app.use(bodyParser.json())

app.get('/puzzle', getPuzzleHandler)

app.get('/spotify', getSpotifySong)

app.post('/spotify', postSpotifySong)

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
