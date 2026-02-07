import blessed from 'blessed'
import { mainLayout } from './screen'

const playlist = blessed.list({
  parent: mainLayout,
  width: '30%',
  height: '100%',
  top: 0,
  left: 0,
  label: ' Playlist ',
  border: { type: 'line' },
  keys: true,
  mouse: true,
  style: { selected: { bg: 'green', fg: 'black' } },
  items: ['No tracks in playlist'],
})

export { playlist }
