import blessed from 'blessed'
import { searchLayout, screen } from './screen'

const searchInput = blessed.textbox({
  parent: searchLayout,
  top: 0,
  left: 0,
  width: '100%',
  height: 3,
  label: ' [ Search tracks by name (Enter to search) ] ',
  border: { type: 'line' },
  style: {
    fg: 'white',
    border: { fg: 'cyan' },
    focus: { border: { fg: 'yellow' } },
  },
  inputOnFocus: true,
})

const searchResult = blessed.list({
  parent: searchLayout,
  top: 3,
  left: 0,
  width: '100%',
  height: '100%-3',
  label: ' Search Result ',
  border: { type: 'line' },
  style: { selected: { bg: 'green', fg: 'black' } },
  items: ['No results yet'],
  keys: true,
})

export { searchInput, searchResult }
