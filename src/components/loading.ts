import { screen } from './screen'
import blessed from 'blessed'

const loadingBox = blessed.box({
  parent: screen,
  width: '100%',
  height: '100%',
  top: '50%',
  left: '50%',
  align: 'center',
  valign: 'middle',
  content: ' Loading ... ',
  hidden: false,
})

export { loadingBox }
