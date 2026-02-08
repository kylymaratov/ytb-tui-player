import debug from '../lib/debug'
import {
  getSearchResultItem,
  setLastPlayed,
  setPlayingNow,
} from '../lib/database'
import { streamTrack } from '../lib/stream-engine'
import { updateTrackCover, updateTrackInfo } from './info'
import { screen } from './screen'
import { setPlaying, showMainScreen } from './scripts'
import { searchResult } from './search'

searchResult.on('select', async (item, index) => {
  try {
    const track = await getSearchResultItem(index)

    if (!track) return

    setPlaying(track)
    showMainScreen()

    screen.render()
  } catch (error) {
    debug((error as Error).message)
  }
})
