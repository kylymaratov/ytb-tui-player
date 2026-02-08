import { spawn } from 'child_process'
import { MpvPlayer } from './mpv-player'
import { debug } from './debug'

export class StreamEngine {
  private readonly mpvPlayer = new MpvPlayer()

  private getStream(url: string) {
    const ytdlp = spawn('yt-dlp', [
      '-o',
      '-',
      '-f',
      'bestaudio',
      '--quiet',
      url,
    ])

    return ytdlp.stdin
  }

  start(url: string) {
    try {
      const stream = this.getStream(url)
      this.mpvPlayer.write(stream)
    } catch (error) {
      debug(error as Error)
    }
  }
}
