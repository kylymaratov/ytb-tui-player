import debug from '../debug/debug'
import { getSearchResultItem, setPlayingNow } from '../lib/database'
import { streamTrack } from '../lib/stream-engine'
import { updateTrackCover, updateTrackInfo } from './info'
import { mainLayout, screen, searchLayout } from './screen'
import { showMainScreen } from './scripts'
import { searchResult } from './search'

searchResult.on('select', async (item, index) => {
  try {
    const track = await getSearchResultItem(index)

    if (!track) return

    setPlayingNow(track)
    streamTrack(track.url)
    updateTrackCover(track)
    updateTrackInfo(track)

    showMainScreen()

    screen.render()
  } catch (error) {
    debug((error as Error).message)
  }
})
