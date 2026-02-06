import Mpv from 'node-mpv'

const player = new Mpv({
  debug: false,
  audio_only: true,
})

export default player
