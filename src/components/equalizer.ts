import contrib from 'blessed-contrib'
import { screen } from './screen'

const grid = new contrib.grid({ rows: 12, cols: 12, screen: screen })

const equalizerBar = grid.set(6, 0, 6, 12, contrib.bar, {
  label: 'Audio Visualizer (Simulated)',
  barWidth: 4,
  barSpacing: 2,
  maxHeight: 15,
  barBgColor: 'green',
})

export { equalizerBar }
