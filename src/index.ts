/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import { getPuzzleHandler, getSpotifySong, postSpotifySong } from './logic/handler'

const app = express()
const port = process.env.PORT ?? 8080

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('src/frontend'))

app.get('/puzzle', getPuzzleHandler)
app.get('/spotify', getSpotifySong)
app.post('/spotify', postSpotifySong)

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
