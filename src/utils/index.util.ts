import os from 'os'

export const isWindows = () => {
  return os.platform() === 'win32'
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return '00:00'

  const minutes = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)

  const formattedMinutes = String(minutes).padStart(2, '0')
  const formattedSeconds = String(secs).padStart(2, '0')

  return `${formattedMinutes}:${formattedSeconds}`
}
