import blessed from 'blessed'
import { mainLayout } from './screen'

const trackInfoLayout = blessed.box({
  parent: mainLayout,
  width: '30%',
  height: '99%',
  top: 0,
  left: 0,
  label: ' {bold}Now playing{/bold} ',
  tags: true,
  border: { type: 'line', fg: 8 },
})

const trackCoverBox = blessed.box({
  parent: trackInfoLayout,
  top: 0,
  left: 'center',
  width: '90%',
  height: '50%',
  align: 'center',
  valign: 'middle',
  tags: true,
  hidden: true,
})

const trackInfoBox = blessed.box({
  parent: trackInfoLayout,
  top: '40%',
  left: 'center',
  width: '90%',
  height: '50%',
  align: 'center',
  valign: 'middle',
  tags: true,
  content: '{center}Select track and press Enter{/center}',
})

const helpBox = blessed.box({
  parent: mainLayout,
  top: '70%',
  left: '30%',
  width: '70%',
  height: '30%',
  align: 'center',
  valign: 'middle',
  tags: true,
  border: { type: 'line', fg: 8 },
  content:
    '↑/↓: Navigation | Enter: Play selected track | Space: Pause/Resume | q: Exit\n\n' +
    'Shift + S: To search screen | Shift + F: Open favorites | Shift + L: Add to favorites\n\n' +
    'Shift + N: Next track | Shift + P: Previus track | Shift + P: Add to playlist\n\n' +
    'Shift + D: Del from playlist or favorites | Shift + H: To hide info box',
  label: 'Info',
})

export { trackCoverBox, trackInfoBox, trackInfoLayout, helpBox }
