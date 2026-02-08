import net from 'net'
import { getIpcPath } from '../utils/ipc.util'
import { debug } from './debug'
import { sleep } from '../utils/index.util'

export class IpcClient {
  private ipcClient: net.Socket | null = null
  readonly ipcPath = getIpcPath()

  async destroyClient() {
    if (this.ipcClient) {
      this.ipcClient.end()
      this.ipcClient = null
    }
  }

  async createClient() {
    try {
      await sleep(5000)
      return await new Promise<net.Socket>((resolve, reject) => {
        const client = net.createConnection(this.ipcPath)
        client.on('connect', () => {
          this.ipcClient = client
          resolve(client)
        })
        client.on('error', (err) => reject(err))
      })
    } catch (error) {
      debug(error as Error)
    }
  }

  async sendCommand(cmd: any) {
    if (!this.ipcClient) return

    try {
      this.ipcClient.write(JSON.stringify(cmd) + '\n')
    } catch (error) {
      debug(error as Error)
    }
  }
}
