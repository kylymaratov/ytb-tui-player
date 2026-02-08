import terminalImage from 'terminal-image'
import { Components } from '../components'
import { trackInfoLayout } from '../components/information'
import { TVideo } from '../types/entities.types'
import { Database } from './database'
import { StreamEngine } from './stream-engine'
import { Youtube } from './youtube-search'
import { MpvPlayer } from './mpv-player'

export class Logic extends Components {
  private readonly youtube = new Youtube()
  private readonly db = new Database()
  private readonly streamEninge = new StreamEngine()
  private readonly mpvPlayer = new MpvPlayer()

  constructor() {
    super()
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

    const query = await this.db.read('lastSearchQuery')

    if (!query) {
      this.searchBox.focus()
      this.screenRender()
      return
    }

    await this.searchTracksByQuery(query)
  }

  async switchToMainScreen() {
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
    this.mpvPlayer.writeStream(trackStream)

    this.updateTrackCover(track)
    this.updateTrackInfo(track)

    this.db.write('playingnow', track)
    this.db.write('lastPlayed', track)

    this.switchToMainScreen()
    this.screenRender()
  }

  async togglePause() {
    this.mpvPlayer.togglePause()
  }

  updateEQ() {
    const simulatedData = Array.from(
      { length: 8 },
      () => Math.floor(Math.random() * 10) + 1,
    )

    this.equalizerBar.setData({
      titles: ['60', '170', '310', '600', '1k', '3k', '6k', '12k'],
      data: simulatedData,
    })

    this.screenRender()
  }

  async exit() {
    await this.mpvPlayer.destroyProcess()
    this.destroyScreen()
    process.exit(0)
  }
}
