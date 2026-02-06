import blessed from 'blessed'
import screen from './screen'

const infoBox = blessed.box({
  parent: screen,
  width: '70%',
  height: '90%',
  top: 3,
  left: '30%',
  label: ' About track',
  border: { type: 'line' },
  content: 'Select track and press Enter',
})

export default infoBox
