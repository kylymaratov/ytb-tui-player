import contrib from 'blessed-contrib'
import { screen } from './screen'

const grid = new contrib.grid({ rows: 12, cols: 12, screen: screen })

const equalizerBar = grid.set(9.5, 3.6, 2.8, 8.4, contrib.bar, {
  label: 'Visualizer',
  barBgColor: 'green',
  barWidth: 4,
  barSpacing: 6,
  maxHeight: 10,
})

export { equalizerBar }
