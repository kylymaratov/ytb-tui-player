import terminalImage from 'terminal-image'
import { Components } from '../components/main'
import { trackInfoLayout } from '../components/information'
import { TVideo } from '../types/entities.types'
import { Database } from '../lib/database'
import { StreamEngine } from '../lib/stream-engine'
import { Youtube } from '../lib/youtube-search'
import { MpvPlayer } from '../lib/mpv-player'
import { debug } from '../lib/debug'
import { formatTime } from '../utils/index.util'

export class MainLogic extends Components {
  private readonly youtube = new Youtube()
  private readonly db = new Database()
  private readonly streamEninge = new StreamEngine()
  private readonly mpvPlayer = new MpvPlayer()
  private progressInterval: NodeJS.Timeout | null = null

  constructor() {
    super()
  }

  async createMpvProcess() {
    await this.mpvPlayer.createProcess()
  }

  updateTrackInfo(track: TVideo, currentSeconds: number) {
    const animationFrames = ['/', '-', '\\', '|']
    const frame = animationFrames[Math.floor(currentSeconds % 4)]

    const totalSeconds = track.durationMs as number

    const barLength = 20
    const progressRatio = totalSeconds > 0 ? currentSeconds / totalSeconds : 0
    const filledLength = Math.round(barLength * progressRatio)

    const progressBar =
      '{green-fg}' +
      '█'.repeat(filledLength) +
      '{/green-fg}' +
      '{gray-fg}' +
      '░'.repeat(barLength - filledLength) +
      '{/gray-fg}'

    this.trackInfoBox.setContent(
      `{bold}Title:{/bold} ${track.title}\n\n` +
        `{bold}Author:{/bold} ${track.author}\n\n` +
        `{bold}Views:{/bold} ${track.views}\n\n` +
        `{bold}Uploaded:{/bold} ${track.uploaded}\n\n` +
        `{bold}Progress:{/bold} ${formatTime(currentSeconds)} / ${formatTime(totalSeconds)}\n` +
        `\n\n[${progressBar}] ${frame}`,
    )
    if (this.trackInfoBox.hidden) this.trackInfoBox.show()

    this.screenRender()
  }

  async updateTrackCover(track: TVideo) {
    if (!track.thumbnail) return

    const width =
      (this.trackCoverBox.width as number) ||
      Math.floor((trackInfoLayout.width as number) * 0.5)
    const height =
      (this.trackCoverBox.height as number) ||
      Math.floor((trackInfoLayout.height as number) * 0.6)

    const res = await fetch(track.thumbnail)
    const buffer = await res.arrayBuffer()

    const imageStr = await terminalImage.buffer(Buffer.from(buffer), {
      width,
      height,
    })

    this.trackCoverBox.setContent(imageStr)
    this.trackCoverBox.show()
    this.screenRender()
  }

  async switchToSearchScreen() {
    this.mainLayout.hide()
    this.searchLayout.show()

    const query = await this.db.read('lastSearchQuery')

    if (!query) {
      this.searchBox.focus()
      this.screenRender()
      return
    }

    await this.searchTracksByQuery(query)
  }

  switchToMainScreen() {
    this.searchLayout.hide()
    this.mainLayout.show()
    this.screenRender()
  }

  async focusOnSearchInput() {
    this.searchBox.focus()
    this.screenRender()
  }

  async searchTracksByQuery(inQuery?: string) {
    this.searchResultBox.clearItems()

    if (inQuery) this.searchBox.setValue(inQuery)

    const query = inQuery ?? this.searchBox.getValue()
    if (!query.trim()) return

    const videos = await this.youtube.search(query)

    videos.forEach((t) => {
      this.searchResultBox.addItem(' ' + t.title)
    })

    this.searchResultBox.setLabel(` Result by query - ${query} `)

    await this.db.write('searchResult', videos)
    await this.db.write('lastSearchQuery', query)

    this.searchResultBox.focus()
    this.screenRender()
  }

  async setPlayingNow(index: number) {
    const tracks = await this.db.read('searchResult')
    const track = tracks ? tracks[index] : null

    if (!track) return

    const trackStream = this.streamEninge.getTrackStream(track.url)
    await this.mpvPlayer.writeStream(trackStream)

    this.updateTrackCover(track)
    this.updateTrackInfo(track, 0)

    if (this.progressInterval) {
      clearInterval(this.progressInterval)
    }

    this.progressInterval = setInterval(() => {
      this.startProgressTracking(track)
    }, 1000)

    this.db.write('playingnow', track)
    this.db.write('lastPlayed', track)

    this.switchToMainScreen()
    this.screenRender()
  }

  async startProgressTracking(track: TVideo) {
    try {
      const currentSeconds = await this.mpvPlayer.getTimePos()

      if (!currentSeconds) return

      this.updateTrackInfo(track, currentSeconds)
    } catch (error) {
      debug(error as Error)
    }
  }

  async togglePause() {
    await this.mpvPlayer.togglePause()
  }

  async exit() {
    await this.mpvPlayer.destroyProcess()
    this.destroyScreen()
    process.exit(0)
  }
}
