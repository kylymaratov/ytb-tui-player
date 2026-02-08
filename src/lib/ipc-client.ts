import net from 'net'
import { getIpcPath } from '../utils/ipc.util'
import { debug } from './debug'
import { sleep } from '../utils/index.util'

export class IpcClient {
  private ipcClient: net.Socket | null = null
  private readonly ipcPath = getIpcPath()

  async destroyClient() {
    if (this.ipcClient) {
      this.ipcClient.end()
      this.ipcClient = null
    }
  }

  async createClient() {
    await sleep(5000)
    return await new Promise<net.Socket>((resolve, reject) => {
      const client = net.createConnection(this.ipcPath)
      client.on('connect', () => {
        this.ipcClient = client
        resolve(client)
      })
      client.on('error', (err) => reject(err))
    })
  }

  async sendCommand<T>(cmd: any): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.ipcClient)
        return reject(new Error('IPC Client not initialized'))

      this.ipcClient.write(JSON.stringify(cmd) + '\n')

      const responseHandler = (data: Buffer) => {
        try {
          const response = JSON.parse(data.toString())
          if (response.request_id === cmd.request_id) {
            this.ipcClient?.off('data', responseHandler)
            resolve(response as T)
          }
        } catch (e) {}
      }

      this.ipcClient.on('data', responseHandler)

      setTimeout(() => {
        this.ipcClient?.off('data', responseHandler)
        reject(new Error('MPV command timeout'))
      }, 5000)
    })
  }
}
