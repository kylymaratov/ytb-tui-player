import terminalImage from 'terminal-image'
import { Components } from '../components'
import { trackInfoLayout } from '../components/information'
import { TVideo } from '../types/entities.types'
import { Database } from './database'
import { StreamEngine } from './stream-engine'
import { Youtube } from './youtube-search'
import { MpvPlayer } from './mpv-player'
import { debug } from './debug'

export class Logic extends Components {
  private readonly youtube = new Youtube()
  private readonly db = new Database()
  private readonly streamEninge = new StreamEngine()
  private readonly mpvPlayer = new MpvPlayer()

  private eqInterval: NodeJS.Timeout | null = null

  constructor() {
    super()
  }

  async createMpvProcess() {
    await this.mpvPlayer.createProcess()
  }

  updateTrackInfo(track: TVideo) {
    const content = `
    {bold}Title:{/bold} ${track.title}

    {bold}Author:{/bold} ${track.author}

    {bold}Duration:{/bold} ${track.duration}
  `
    this.trackInfoBox.setContent(content)
    this.trackInfoBox.show()
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
    this.equalizerBar.hide()

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
    this.equalizerBar.show()
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
    this.updateTrackInfo(track)

    this.db.write('playingnow', track)
    this.db.write('lastPlayed', track)

    this.startEQUpdate()
    this.switchToMainScreen()
    this.screenRender()
  }

  async togglePause() {
    await this.mpvPlayer.togglePause()

    const paused = await this.mpvPlayer.isPaused()

    if (paused) {
      this.stopEQUpdate()
      this.clearEQBars()
    } else {
      this.startEQUpdate()
    }
  }

  clearEQBars() {
    this.equalizerBar.setData({
      titles: ['60', '170', '310', '600', '1k', '3k', '6k', '12k'],
      data: new Array(8).fill(0),
    })
    this.screenRender()
  }

  updateEQ() {
    const simulatedData = Array.from(
      { length: 10 },
      () => Math.floor(Math.random() * 10) + 1,
    )

    this.equalizerBar.setData({
      titles: simulatedData.map((_, i) => '-'),
      data: simulatedData,
    })

    this.screenRender()
  }

  startEQUpdate() {
    this.stopEQUpdate()

    this.eqInterval = setInterval(() => {
      this.updateEQ()
    }, 150)
  }

  stopEQUpdate() {
    if (this.eqInterval) {
      clearInterval(this.eqInterval)
      this.eqInterval = null
    }
  }

  async exit() {
    await this.mpvPlayer.destroyProcess()
    this.destroyScreen()
    process.exit(0)
  }
}
