import { spawn, ChildProcess } from 'child_process'
import Stream from 'stream'
import { IpcClient } from './ipc-client'
import { getIpcPath } from '../utils/ipc.util'

export class MpvPlayer {
  private readonly ipcClient = new IpcClient()
  private mpvProcess: ChildProcess | null = null

  private readonly mpvArgs = [
    '--no-video',
    '--no-terminal',
    '--quiet',
    '--really-quiet',
    `--input-ipc-server=${getIpcPath()}`,
    '-',
  ]

  async createProcess() {
    return await new Promise((resovle, reject) => {
      this.mpvProcess = spawn('mpv', this.mpvArgs, {
        stdio: ['pipe', 'ignore', 'ignore'],
      })

      this.mpvProcess.on('close', () => this.createProcess())
      this.mpvProcess.on('exit', () => this.destroyProcess())
      this.mpvProcess.on('error', (error) => reject(error))

      this.ipcClient.createClient().then(() => {
        resovle('Success')
      })
    })
  }

  async destroyProcess() {
    if (this.mpvProcess) {
      this.mpvProcess.kill()
      this.mpvProcess = null
    }
    await this.ipcClient.destroyClient()
  }

  async writeStream(inputStream: Stream.Readable) {
    if (!this.mpvProcess?.stdin) return

    await this.ipcClient.sendCommand({ command: ['loadfile', '-', 'replace'] })

    inputStream.pipe(this.mpvProcess.stdin, { end: false })
  }

  async isPaused(): Promise<boolean> {
    const response = await this.ipcClient.sendCommand<{ data: boolean }>({
      command: ['get_property', 'pause'],
      request_id: Math.floor(Math.random() * 10000),
    })
    return response.data
  }

  async togglePause() {
    await this.ipcClient.sendCommand({ command: ['cycle', 'pause'] })
  }

  async getTimePos() {
    const requestId = Math.floor(Math.random() * 10000)

    const cmd = {
      request_id: requestId,
      command: ['get_property', 'time-pos'],
    }

    const response = await this.ipcClient.sendCommand<{ data: number }>(cmd)

    if (response && typeof response.data === 'number') {
      const currentSeconds = response.data

      return currentSeconds
    }
  }
}
