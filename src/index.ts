/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import {
  getNextPuzzleMetadataHandler,
  getPuzzleHandler,
  getSpotifySong,
  postSpotifySong,
  getRSAPuzzleHandler,
  postRSAPuzzleHandler,
} from './logic/handler'

const app = express()
const port = process.env.PORT ?? 8080

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('src/public'))

app.get('/nextPuzzleMetadata', getNextPuzzleMetadataHandler)
app.get('/puzzle', getPuzzleHandler)
app.get('/spotify', getSpotifySong)
app.post('/spotify', postSpotifySong)
app.get('/rsa', getRSAPuzzleHandler)
app.post('/rsa', postRSAPuzzleHandler)

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
