import blessed from 'blessed'
import { mainLayout } from './screen'

const trackInfoLayout = blessed.box({
  parent: mainLayout,
  width: '70%',
  height: '100%',
  top: 0,
  left: '30%',
  label: ' {bold}Now playing{/bold} ',
  border: { type: 'line' },
  tags: true,
  style: { border: { fg: 'green' } },
})

const trackCoverBox = blessed.box({
  parent: trackInfoLayout,
  top: 1,
  left: 'center',
  width: '50%',
  height: '50%',
  align: 'center',
  valign: 'top',
  tags: true,
  hidden: true,
})

const trackInfoBox = blessed.box({
  parent: trackInfoLayout,
  top: '40%',
  left: 'center',
  width: '80%',
  height: '30%',
  align: 'center',
  valign: 'top',
  tags: true,
  content: 'Select track and press Enter',
})

export { trackCoverBox, trackInfoBox, trackInfoLayout }
