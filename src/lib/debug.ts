import fs from 'fs'
const logFile = fs.createWriteStream('./debug.log')

export const debug = (error: Error) => {
  logFile.write(error.message + '\n')
}
