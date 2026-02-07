import contrib from 'blessed-contrib'
import { screen } from './screen'

const grid = new contrib.grid({ rows: 12, cols: 12, screen: screen })

const bar = grid.set(6, 0, 6, 12, contrib.bar, {
  label: 'Audio EQ',
  barWidth: 4,
  barSpacing: 2,
  maxHeight: 10,
  barBgColor: 'green',
})

bar.setData({
  titles: ['60', '170', '310', '600', '1k', '3k', '6k', '12k'],
  data: [5, 8, 12, 6, 3, 9, 4, 7],
})
screen.render()
