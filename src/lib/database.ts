import { debug } from 'console'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import path from 'path'
import { VideoSearchResult } from 'yt-search'
import { Video } from './youtube-search'

interface Data {
  searchResult: Array<Video>
  playingnow: Video | null
  lastSearchQuery: string
}

const file = path.join(process.cwd(), 'db.json')
const adapter = new JSONFile<Data>(file)
const defaultData: Data = {
  searchResult: [],
  playingnow: null,
  lastSearchQuery: '',
}

const db = new Low<Data>(adapter, defaultData)

const setLastSearchQuery = async (query: string) => {
  try {
    await db.read()
    db.data.lastSearchQuery = query
    await db.write()
  } catch (error) {
    debug((error as Error).message)
  }
}

const getLastSearchQuery = async () => {
  try {
    await db.read()
    return db.data.lastSearchQuery
  } catch (error) {
    debug((error as Error).message)
  }
}

const setSearchResult = async (data: Video[]) => {
  try {
    await db.read()
    db.data.searchResult = data
    await db.write()
  } catch (error) {
    debug((error as Error).message)
  }
}

const getSearchResult = async () => {
  try {
    await db.read()
    return db.data.searchResult
  } catch (error) {
    debug((error as Error).message)
    return null
  }
}

const getSearchResultItem = async (trackIndex: number) => {
  try {
    await db.read()
    const trackData = db.data.searchResult[trackIndex]

    if (!trackData) return null

    return trackData
  } catch (error) {
    debug((error as Error).message)
    return null
  }
}

const getSearchResultCount = async () => {
  try {
    await db.read()
    return db.data.searchResult.length
  } catch (error) {
    debug((error as Error).message)
    return 0
  }
}

const setPlayingNow = async (data: Video) => {
  try {
    await db.read()
    db.data.playingnow = data
    await db.write()
  } catch (error) {
    debug((error as Error).message)
  }
}

const getPlayingNow = async () => {
  try {
    await db.read()
    return db.data.playingnow
  } catch (error) {
    debug((error as Error).message)
    return null
  }
}

export {
  setSearchResult,
  setPlayingNow,
  getPlayingNow,
  getSearchResult,
  getSearchResultItem,
  getSearchResultCount,
  setLastSearchQuery,
  getLastSearchQuery,
}
