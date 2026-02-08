import blessed from 'blessed'
import { mainLayout } from './screen'

const trackInfoLayout = blessed.box({
  parent: mainLayout,
  width: '70%',
  height: '80%',
  top: 0,
  left: '30%',
  label: ' {bold}Now playing{/bold} ',
  border: { type: 'line' },
  tags: true,
  style: {
    border: { fg: 'green' },
  },
})

const trackCoverBox = blessed.box({
  parent: trackInfoLayout,
  top: 0,
  left: 'center',
  width: '50%',
  height: '50%',
  align: 'center',
  valign: 'middle',
  tags: true,
  hidden: true,
})

const trackInfoBox = blessed.box({
  parent: trackInfoLayout,
  top: '55%',
  left: 'center',
  width: '80%',
  height: '30%',
  align: 'center',
  valign: 'middle',
  tags: true,
  content: '{center}Select track and press Enter{/center}',
})

export { trackCoverBox, trackInfoBox, trackInfoLayout }
