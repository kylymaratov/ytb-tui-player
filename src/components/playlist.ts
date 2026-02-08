import blessed from 'blessed'
import { mainLayout } from './screen'

const playlistBox = blessed.list({
  parent: mainLayout,
  width: '30%',
  height: '99%',
  top: 0,
  left: 0,
  label: ' Playlist ',
  border: { type: 'line' },
  keys: true,
  mouse: true,
  style: {
    fg: 'white',
    bg: 'black',
    border: {
      fg: 'yellow',
    },
    selected: {
      bg: 'white',
      fg: 'black',
      bold: true,
    },
  },
})

export { playlistBox }
