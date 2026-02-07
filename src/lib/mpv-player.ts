import { spawn, ChildProcess } from 'child_process'
import debug from '../debug/debug'
import Stream from 'stream'
import {
  createIpcClient,
  destroyIpcClient,
  ipcPath,
  sendCommand,
} from './ipc-client'

let currentMpvProcess: ChildProcess | null = null

const destroyPlayerStream = () => {
  if (currentMpvProcess) {
    currentMpvProcess.kill()
    currentMpvProcess = null
  }
  destroyIpcClient()
}

const createPlayer = () => {
  try {
    currentMpvProcess = spawn(
      'mpv',
      [
        '--no-video',
        '--no-terminal',
        '--quiet',
        '--really-quiet',
        `--input-ipc-server=${ipcPath}`,
        '-',
      ],
      { stdio: ['pipe', 'ignore', 'ignore'] },
    )

    currentMpvProcess.on('close', () => destroyPlayerStream())
    currentMpvProcess.on('exit', () => destroyPlayerStream())
    currentMpvProcess.on('error', (err) => debug(err.message))
    setTimeout(() => createIpcClient(), 5000)
  } catch (error) {
    debug((error as Error).message)
  }
}

const writeStream = (inputStream: Stream.Readable) => {
  if (!currentMpvProcess?.stdin) return

  sendCommand({ command: ['loadfile', '-', 'replace'] })

  inputStream.pipe(currentMpvProcess.stdin, { end: false })
}

const togglePause = () => {
  sendCommand({ command: ['cycle', 'pause'] })
}

export { destroyPlayerStream, togglePause, writeStream, createPlayer }
