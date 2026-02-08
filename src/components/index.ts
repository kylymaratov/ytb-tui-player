import { trackCoverBox, trackInfoBox, trackInfoLayout } from './information'
import { playlistBox } from './playlist'
import { mainLayout, screen, searchLayout } from './screen'
import { searchBox, searchResultBox } from './search'

export class Components {
  readonly searchBox = searchBox
  readonly searchResultBox = searchResultBox
  readonly playlistbox = playlistBox
  readonly mainLayout = mainLayout
  readonly searchLayout = searchLayout
  readonly trackInfoBox = trackInfoBox
  readonly trackCoverBox = trackCoverBox
  readonly tackInfoLayout = trackInfoLayout
  private readonly screen = screen

  screenRender() {
    screen.render()
  }

  destroyScreen() {
    screen.destroy()
  }

  getScreen() {
    return this.screen
  }
}
