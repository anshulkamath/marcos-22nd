import fs from 'fs'
import { DateTime } from 'luxon'
import path from 'path'
import util from 'util'

export const LOG_PATH = 'logs'
export const LOG_NAME = process.env.LOG_NAME ?? 'node'
export const FILE_LOG_NAME = `${LOG_NAME}.access.log`
export const FILE_ERROR_NAME = `${LOG_NAME}.error.log`

export const createWriteStream = (filename: string): fs.WriteStream =>
  fs.createWriteStream(path.join(global.appRoot, LOG_PATH, filename), {
    flags: 'a',
  })

export const createLogWrapper = (writeStream: fs.WriteStream) => (d: any) => {
  const date = DateTime.now().setZone('America/New_York').toFormat('[LL/dd/yyyy @ HH:mm:ss.uu]')
  writeStream.write(`${date}: ${util.format(d)}\n`)
}
