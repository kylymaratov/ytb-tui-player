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

const trackInfoBox = blessed.box({
  parent: trackInfoLayout,
  top: 'center',
  left: '2%',
  width: '55%',
  height: '80%',
  align: 'left',
  valign: 'middle',
  tags: true,
})

const trackCoverBox = blessed.box({
  parent: trackInfoLayout,
  top: 'center',
  left: '60%',
  width: '35%',
  height: '70%',
  align: 'center',
  valign: 'middle',
  tags: true,
  hidden: true,
})

const helpBox = blessed.box({
  parent: mainLayout,
  top: '80%',
  left: '30%',
  width: '70%',
  height: '20%',
  align: 'center',
  valign: 'middle',
  tags: true,
  border: { type: 'line', fg: 8 },
  content:
    '{bold}Управление:{/bold}\n' +
    '↑/↓: Навигация | Enter: Воспроизвести\n' +
    'Space: Пауза | q: Выход',
  label: 'Instrucation',
})

export { trackCoverBox, trackInfoBox, trackInfoLayout, helpBox }
