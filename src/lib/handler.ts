import { debug } from './debug'
import { Logic } from './logic'

export class Handler extends Logic {
  constructor() {
    super()
  }

  async init() {
    try {
      this.registerEvents()
      this.registerKeyBinds()
      this.screenRender()
      this.createMpvProcess()
    } catch (error) {
      debug(error as Error)
      console.error((error as Error).message)
    }
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

  registerKeyBinds() {
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
          return await this.togglePause()
        }
      } catch (error) {
        debug(error as Error)
      }
    })

    screen.key(['q', 'C-c'], async () => {
      try {
        await this.exit()
      } catch (error) {
        debug(error as Error)
      }
    })
  }
}
