import player from './player'
import screen from './screen'
import { searchButton } from './search'

screen.key(['q', 'C-c'], async () => {
  try {
    await player.quit()
  } catch (e) {}

  screen.destroy()
  process.exit(0)
})

screen.key(['s'], async () => {
  try {
    searchButton.focus()
  } catch {}
})
