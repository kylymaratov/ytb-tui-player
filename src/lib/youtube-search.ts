import yts, { VideoSearchResult } from 'yt-search'
import ytdl from 'ytdl-core'
import { debug } from './debug'
import { TVideo } from '../types/entities.types'

import { Innertube, UniversalCache } from 'youtubei.js'

process.env.YOUTUBEJS_NO_LOGS = 'true'

export class Youtube {
  private isMusicTrack(video: VideoSearchResult): boolean {
    if (!video) return false

    const maxDurationSeconds = 15 * 60

    return video.duration.seconds < maxDurationSeconds
  }

  async search(query: string): Promise<TVideo[]> {
    try {
      const { videos } = await yts.search(query)

      const filteredVideos = videos.filter((v) => this.isMusicTrack(v))

      return filteredVideos.map((v) => ({
        videoId: v.videoId,
        title: v.title,
        author: v.author.name,
        url: v.url,
        thumbnail: v.thumbnail ?? '',
        duration: v.duration.timestamp,
        durationMs: v.duration.seconds,
      }))
    } catch (error) {
      debug(error as Error)
      return []
    }
  }

  async getRelated(url: string): Promise<TVideo[]> {
    try {
      return []
    } catch (error) {
      debug(error as Error)
      return []
    }
  }
}
