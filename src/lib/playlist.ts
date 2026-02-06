import blessed from 'blessed'
import screen from './screen'
import player from './player'
import infoBox from './info'

const playlist = blessed.list({
  parent: screen,
  width: '30%',
  height: '90%',
  top: 3,
  left: 0,
  label: ' Playlist ',
  border: { type: 'line' },
  keys: true,
  mouse: true,
  style: { selected: { bg: 'green', fg: 'black' } },
})

const tracks = [
  { name: 'Lo-fi Beat', file: './music/track1.mp3' },
  { name: 'Synthwave', file: './music/track2.mp3' },
]

tracks.forEach((t) => playlist.addItem(t.name))

playlist.on('select', (item, index) => {
  const track = tracks[index] as any
  player.load(track.file)
  infoBox.setContent(`{bold}Now playing:{/bold}\n${track.name}`)
  screen.render()
})

playlist.focus()

export default playlist
