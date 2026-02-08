import { spawn } from 'child_process'
import { MpvPlayer } from './mpv-player'
import { debug } from './debug'

export class StreamEngine {
  getTrackStream(url: string) {
    const ytdlp = spawn('yt-dlp', [
      '-o',
      '-',
      '-f',
      'bestaudio',
      '--quiet',
      url,
    ])

    return ytdlp.stdout
  }
}
