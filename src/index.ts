/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path from 'path'

import {
  getPuzzleMetadataHandler,
  getPuzzleHandler,
  postPuzzleHandler,
} from 'controllers/puzzle.controller'

import { getSpotifySong, postSpotifySong } from 'controllers/spotify.controller'
import { getRSAPuzzleHandler, postRSAPuzzleHandler } from 'controllers/rsa.controller'

import {
  getHomeViewHandler,
  getRSAViewHandler,
  getRevbViewHandler,
  getMemoryLaneViewHandler,
  getCongratsViewHandler,
} from 'controllers/view.controller'

const app = express()
const port = process.env.PORT ?? 8080

app.use(cors())
app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.static('src/public'))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// pages
app.get('/', getHomeViewHandler)
app.get('/mystery', getRSAViewHandler)
app.get('/revb', getRevbViewHandler)
app.get('/memory-lane', getMemoryLaneViewHandler)
app.get('/marcos-bday', getCongratsViewHandler)
app.get('/riggs', getCongratsViewHandler)

// api
app.get('/puzzleMetadata', getPuzzleMetadataHandler)
app.get('/puzzle', getPuzzleHandler)
app.post('/puzzle', postPuzzleHandler)

app.get('/memory-lane/api', getSpotifySong)
app.post('/memory-lane/api', postSpotifySong)

app.get('/rsa', getRSAPuzzleHandler)
app.post('/rsa', postRSAPuzzleHandler)

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
