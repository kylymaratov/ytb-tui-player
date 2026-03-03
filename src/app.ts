import { debug } from './lib/debug'
import { MainLogic } from './logic/main-logic'

export class App extends MainLogic {
  constructor() {
    super()
  }

  async init() {
    try {
      this.createMpvProcess().then(() => {
        this.registerEvents()
        this.registerKeyBinds()
        this.screenRender()

        this.mainLayout.show()
        this.loadingBox.hide()
        this.screenRender()
      })
    } catch (error) {
      debug(error as Error)
      throw error
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
