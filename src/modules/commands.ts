import { togglePause } from '../lib/mpv-player'
import { searchInput } from './search'
import {
  appExit,
  focusOnSearchInput,
  searchTracks,
  showMainScreen,
  showSearchScreen,
} from './scripts'
import { screen, searchLayout } from './screen'

screen.on('keypress', async (_ch, key) => {
  if (key.name === 's' && key.shift && searchLayout.hidden) {
    return showSearchScreen()
  }
  if (key.name === 'w' && key.shift && !searchLayout.hidden) {
    return focusOnSearchInput()
  }
  if (key.name === 'escape') {
    return showMainScreen()
  }
  if (key.name === 'space') {
    return togglePause()
  }
})

searchInput.key('enter', async () => {
  await searchTracks()
  screen.render()
})
screen.key(['q', 'C-c'], appExit)
