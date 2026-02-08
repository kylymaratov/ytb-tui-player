import { spawn } from 'child_process'
import { MpvPlayer } from './mpv-player'
import { debug } from './debug'

export class StreamEngine {
  private readonly getStreamArgs = (url: string) => [
    '-o',
    '-',
    '-f',
    'bestaudio',
    '--quiet',
    url,
  ]

  getTrackStream(url: string) {
    const ytdlp = spawn('yt-dlp', this.getStreamArgs(url))

    return ytdlp.stdout
  }
}
