import debug from '../debug/debug'
import {
  getLastSearchQuery,
  setLastPlayed,
  setLastSearchQuery,
  setPlayingNow,
  setSearchResult,
} from '../lib/database'
import { searchVideos, Video } from '../lib/youtube-search'
import { destroyPlayerStream } from '../lib/mpv-player'
import { mainLayout, screen, searchLayout } from './screen'
import { searchInput, searchResult } from './search'
import { streamTrack } from '../lib/stream-engine'
import { updateTrackCover, updateTrackInfo } from './info'

const showSearchScreen = async () => {
  try {
    mainLayout.hide()
    searchLayout.show()

    const query = await getLastSearchQuery()

    if (!query) {
      searchInput.focus()
      screen.render()
      return
    }

    await searchTracks(query)
  } catch (error) {
    debug((error as Error).message)
  }
}

const showMainScreen = () => {
  try {
    searchLayout.hide()
    mainLayout.show()
    screen.render()
  } catch (error) {
    debug((error as Error).message)
  }
}

const appExit = () => {
  try {
    destroyPlayerStream()
    screen.destroy()
    process.exit(0)
  } catch (error) {
    debug((error as Error).message)
  }
}

const focusOnSearchInput = () => {
  searchInput.focus()
  screen.render()
}

const searchTracks = async (inQuery?: string) => {
  try {
    searchResult.clearItems()

    if (inQuery) searchInput.setValue(inQuery)

    const query = inQuery ?? searchInput.getValue()
    if (!query.trim()) return

    const videos = await searchVideos(query)

    videos.forEach((t) => {
      searchResult.addItem(' ' + t.title)
    })

    searchResult.setLabel(` Result by query - ${query} `)

    await setSearchResult(videos)
    await setLastSearchQuery(query)

    searchResult.focus()
    screen.render()
  } catch (error) {
    debug((error as Error).message)
  }
}

const setPlaying = async (track: Video) => {
  setPlayingNow(track)
  streamTrack(track.url)
  updateTrackCover(track)
  updateTrackInfo(track)
  setLastPlayed(track)
}

export {
  showSearchScreen,
  showMainScreen,
  appExit,
  focusOnSearchInput,
  searchTracks,
  setPlaying,
}
