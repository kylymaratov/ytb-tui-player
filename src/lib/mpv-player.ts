import { spawn, ChildProcess } from 'child_process'
import Stream from 'stream'
import { IpcClient } from './ipc-client'
import { debug } from './debug'

export class MpvPlayer {
  private readonly ipcClient = new IpcClient()
  private mpvProcess: ChildProcess | null = null

  private readonly mpvArgs = [
    '--no-video',
    '--no-terminal',
    '--quiet',
    '--really-quiet',
    `--input-ipc-server=${this.ipcClient.ipcPath}`,
    '-',
  ]

  async create() {
    try {
      return await new Promise((resovle, reject) => {
        this.mpvProcess = spawn('mpv', this.mpvArgs, {
          stdio: ['pipe', 'ignore', 'ignore'],
        })

        this.mpvProcess.on('close', () => this.destroy())
        this.mpvProcess.on('exit', () => this.destroy())
        this.mpvProcess.on('error', (error) => reject(error))

        this.ipcClient.create().then(() => {
          resovle('Success')
        })
      })
    } catch (error) {
      debug(error as Error)
    }
  }

  async destroy() {
    if (this.mpvProcess) {
      this.mpvProcess.kill()
      this.mpvProcess = null
    }
    await this.ipcClient.destroy()
  }

  async write(inputStream: Stream.Writable) {
    try {
      if (!this.mpvProcess?.stdin) return

      this.ipcClient.sendCommand({ command: ['loadfile', '-', 'replace'] })

      inputStream.pipe(this.mpvProcess.stdin, { end: false })
    } catch (error) {
      debug
    }
  }

  togglePause = () => {
    this.ipcClient.sendCommand({ command: ['cycle', 'pause'] })
  }
}
