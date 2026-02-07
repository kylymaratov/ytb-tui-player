import { spawn } from 'child_process'
import { writeStream } from './mpv-player'

const streamTrack = (url: string) => {
  const ytdlp = spawn('yt-dlp', ['-o', '-', '-f', 'bestaudio', '--quiet', url])

  writeStream(ytdlp.stdout)
}

export { streamTrack }
