import blessed from 'blessed'
import { mainLayout } from './screen'

const playlistBox = blessed.list({
  parent: mainLayout,
  width: '70%',
  height: '70%',
  top: 0,
  left: '30%',
  label: ' Playlist ',
  border: { type: 'line', fg: 8 },
  keys: true,
  mouse: true,
  style: {
    selected: {
      bg: 'white',
      fg: 'black',
      bold: true,
    },
  },
})

export { playlistBox }
