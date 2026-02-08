import debug from '../lib/debug'
import { getLastPlayed, setPlayingNow } from '../lib/database'
import { togglePause } from '../lib/mpv-player'
import { screen } from './screen'
import { setPlaying } from './scripts'
;(async () => {
  try {
    const lastPlayed = await getLastPlayed()

    if (!lastPlayed) return

    await setPlaying(lastPlayed)
    screen.render()
  } catch (error) {
    debug((error as Error).message)
  }
})()
