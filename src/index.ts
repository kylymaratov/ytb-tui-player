import { screen } from './modules/screen'
import { createPlayer } from './lib/mpv-player'
import './modules/commands'
import './modules/playlist'
import './modules/search'
import './modules/info'
import './modules/events'
import './modules/last-played'

screen.render()
createPlayer()
