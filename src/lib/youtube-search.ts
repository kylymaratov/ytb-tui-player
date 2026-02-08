import yts, { VideoSearchResult } from 'yt-search'
import { exec } from 'child_process'
import { debug } from './debug'
import { TVideo } from '../types/entities.types'

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

  async related(videoId: string) {
    return new Promise((resolve, reject) => {
      exec(
        `yt-dlp --dump-json https://www.youtube.com/watch?v=${videoId}`,
        (err, stdout, stderr) => {
          if (err) {
            return reject(
              `Error fetching video metadata: ${stderr || err.message}`,
            )
          }

          try {
            const metadata = JSON.parse(stdout)

            const relatedVideos: TVideo[] =
              metadata.related_videos?.map((video: any) => ({
                videoId: video.id,
                title: video.title,
                author: video.uploader,
                thumbnail: video.thumbnail,
                diration: video.duration,
              })) || []

            resolve(relatedVideos)
          } catch (parseError) {
            reject('Error parsing yt-dlp JSON output')
          }
        },
      )
    })
  }
}
