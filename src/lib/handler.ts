import { debug } from './debug'
import { Logic } from './logic'

export class Handler extends Logic {
  constructor() {
    super()
  }

  init() {
    this.registerEvents()
    this.registerKeyBinds()
    this.screenRender()
  }

  registerEvents() {
    this.searchResultBox.on('select', async (_ch, index) => {
      try {
        await this.setPlayingNow(index)
      } catch (error) {
        debug(error as Error)
      }
    })
    this.searchBox.key('enter', async () => {
      try {
        await this.searchTracksByQuery()
      } catch (error) {
        debug(error as Error)
      }
    })
  }

  async registerKeyBinds() {
    const screen = this.getScreen()

    screen.on('keypress', async (_ch, key) => {
      try {
        if (key.name === 's' && key.shift && this.searchLayout.hidden) {
          return await this.switchToSearchScreen()
        }
        if (key.name === 'w' && key.shift && !this.searchLayout.hidden) {
          return this.focusOnSearchInput()
        }
        if (key.name === 'escape') {
          return this.switchToMainScreen()
        }
        if (key.name === 'space') {
          return this.togglePause()
        }
      } catch (error) {
        debug(error as Error)
      }
    })

    screen.key(['q', 'C-c'], () => this.exit())
  }
}
