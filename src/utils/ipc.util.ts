import path from 'path'
import os from 'os'
import { isWindows } from './index.util'

export const getIpcPath = () => {
  return isWindows()
    ? '\\\\.\\pipe\\mpvpipe'
    : path.join(os.tmpdir(), 'mpvpipe')
}
