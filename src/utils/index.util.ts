import os from 'os'

export const isWindows = () => {
  return os.platform() === 'win32'
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
