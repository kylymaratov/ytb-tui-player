import blessed from 'blessed'

const screen = blessed.screen({
  smartCSR: true,
  title: 'Youtube TUI music player',
})

const mainLayout = blessed.box({
  parent: screen,
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  hidden: false,
})

const searchLayout = blessed.box({
  parent: screen,
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  hidden: true,
})

export { screen, mainLayout, searchLayout }
