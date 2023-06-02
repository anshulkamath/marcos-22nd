import fs from 'fs'
import { DateTime } from 'luxon'
import path from 'path'
import util from 'util'

export const LOG_PATH = 'logs'
export const FILE_LOG_NAME = 'node.access.log'
export const FILE_ERROR_NAME = 'node.error.log'

export const createWriteStream = (filename: string): fs.WriteStream =>
  fs.createWriteStream(path.join(global.appRoot, LOG_PATH, filename), {
    flags: 'a',
  })

export const createLogWrapper = (writeStream: fs.WriteStream) => (d: any) => {
  const date = DateTime.now().setZone('America/New_York').toFormat('[LL/dd/yyyy @ HH:mm:ss.uu]')
  writeStream.write(`${date}: ${util.format(d)}\n`)
}
