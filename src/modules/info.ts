import blessed from 'blessed'
import { mainLayout } from './screen'
import sharp from 'sharp'
import terminalImage from 'terminal-image'
import fetch from 'node-fetch'
import { Video } from '../lib/youtube-search'
import debug from '../lib/debug'

const infoBox = blessed.box({
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

const coverBox = blessed.box({
  parent: infoBox,
  top: 1,
  left: 'center',
  width: '50%',
  height: '50%',
  align: 'center',
  valign: 'top',
  tags: true,
  hidden: true,
})

const textBox = blessed.box({
  parent: infoBox,
  top: '40%',
  left: 'center',
  width: '80%',
  height: '30%',
  align: 'center',
  valign: 'top',
  tags: true,
  content: 'Select track and press Enter',
})

const updateTrackInfo = (track: Video) => {
  const content = `
{bold}Title:{/bold} ${track.title}

{bold}Author:{/bold} ${track.author}

{bold}Duration:{/bold} ${track.duration}
  `
  textBox.setContent(content)
  textBox.show()
}

const updateTrackCover = async (track: Video) => {
  try {
    if (!track.thumbnail) return

    const width =
      (coverBox.width as number) || Math.floor((infoBox.width as number) * 0.5)
    const height =
      (coverBox.height as number) ||
      Math.floor((infoBox.height as number) * 0.6)

    const res = await fetch(track.thumbnail)
    const buffer = await res.arrayBuffer()

    const imageStr = await terminalImage.buffer(Buffer.from(buffer), {
      width,
      height,
    })

    coverBox.setContent(imageStr)
    coverBox.show()
    coverBox.render()
  } catch (error) {
    debug((error as Error).message)
  }
}

export { infoBox, updateTrackInfo, updateTrackCover }
