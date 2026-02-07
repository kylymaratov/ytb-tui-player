import debug from '../debug/debug'
import { getLastPlayed, setPlayingNow } from '../lib/database'
import { screen } from './screen'
import { setPlaying } from './scripts'
;(async () => {
  try {
    const lastPlayed = await getLastPlayed()

    if (!lastPlayed) return

    setPlaying(lastPlayed)
    screen.render()
  } catch (error) {
    debug((error as Error).message)
  }
})()
