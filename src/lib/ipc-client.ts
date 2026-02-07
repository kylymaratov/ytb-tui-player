import { spawn, ChildProcess } from 'child_process'
import debug from '../debug/debug'
import Stream from 'stream'
import os from 'os'
import path from 'path'
import net from 'net'
import fs from 'fs/promises'

let ipcClient: net.Socket | null = null

const ipcPath =
  os.platform() === 'win32'
    ? '\\\\.\\pipe\\mpvpipe'
    : path.join(os.tmpdir(), 'mpvpipe')

const destroyIpcClient = () => {
  if (ipcClient) {
    ipcClient.end()
    ipcClient = null
  }
}

const createIpcClient = async (retries = 5, delay = 100) => {
  try {
    new Promise<net.Socket>((resolve, reject) => {
      const client = net.createConnection(ipcPath)
      client.on('connect', () => {
        ipcClient = client
        resolve(client)
      })
      client.on('error', (err) => reject(err))
    })
  } catch (error) {
    debug((error as Error).message)
  }
}

const sendCommand = (cmd: any) => {
  try {
    ipcClient?.write(JSON.stringify(cmd) + '\n')
  } catch (err) {
    debug('sendCommand error: ' + (err as Error).message)
  }
}

export { createIpcClient, destroyIpcClient, sendCommand, ipcPath }
