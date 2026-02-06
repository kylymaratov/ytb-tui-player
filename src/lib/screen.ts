import blessed from 'blessed'

const screen = blessed.screen({
  smartCSR: true,
  title: 'Youtube TUI music player',
})

export default screen
