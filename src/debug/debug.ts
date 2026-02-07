import fs from 'fs'
const logFile = fs.createWriteStream('./debug.log')

function debug(message: string) {
  logFile.write(message + '\n')
}

export default debug
