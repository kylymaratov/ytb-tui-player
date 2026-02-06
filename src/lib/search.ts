import blessed from 'blessed'
import screen from './screen'

const searchButton = blessed.button({
  parent: screen,
  top: 0,
  left: 0,
  width: 10,
  height: 3,
  content: ' Search ',
  align: 'right',
  valign: 'middle',
  border: { type: 'line' },
  style: {
    fg: 'white',
    bg: 'blue',
    border: { fg: 'blue' },
    focus: { bg: 'cyan' },
    hover: { bg: 'cyan' },
  },
})

// const searchInput = blessed.textbox({
//   parent: screen,
//   top: 0,
//   left: 0,
//   width: '100%',
//   height: 3,
//   label: ' [ Search songs by name (Enter to search) ] ',
//   border: { type: 'line' },
//   style: {
//     fg: 'white',
//     border: { fg: 'cyan' },
//     focus: { border: { fg: 'yellow' } },
//   },
//   inputOnFocus: false,
// })

export { searchButton }
