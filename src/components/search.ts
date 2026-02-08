import blessed from 'blessed'
import { searchLayout, screen } from './screen'

const searchBox = blessed.textbox({
  parent: searchLayout,
  top: 0,
  left: 0,
  width: '100%',
  height: 3,
  label: ' [ Search tracks by author or name (Enter to search) ] ',
  border: { type: 'line' },
  style: {
    fg: 'white',
    border: { fg: 'cyan' },
    focus: { border: { fg: 'yellow' } },
  },
  inputOnFocus: true,
})

const searchResultBox = blessed.list({
  parent: searchLayout,
  top: 3,
  left: 0,
  width: '100%',
  height: '100%-3',
  border: { type: 'line' },
  style: {
    fg: 'white',
    bg: 'black',

    selected: {
      bg: 'white',
      fg: 'black',
      bold: true,
    },
  },

  keys: true,
})

export { searchBox, searchResultBox }
