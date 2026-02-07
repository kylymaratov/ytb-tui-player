import yts, { VideoSearchResult } from 'yt-search'
import { exec } from 'child_process'

export interface Video {
  videoId: string
  title: string
  author: string
  url: string
  thumbnail: string
  duration: string
}

const isMusicTrack = (video: VideoSearchResult): boolean => {
  if (!video) return false

  const maxDurationSeconds = 15 * 60

  return video.duration.seconds < maxDurationSeconds
}

const searchVideos = async (query: string): Promise<Video[]> => {
  try {
    const { videos } = await yts.search(query)

    const filteredVideos = videos.filter((v) => isMusicTrack(v))

    return filteredVideos.map((v) => ({
      videoId: v.videoId,
      title: v.title,
      author: v.author.name,
      url: v.url,
      thumbnail: v.thumbnail ?? '',
      duration: v.duration.timestamp,
    }))
  } catch (error) {
    throw error
  }
}

const getRelatedVideos = async (videoId: string): Promise<Video[]> => {
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

          const relatedVideos: Video[] =
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
export { getRelatedVideos, searchVideos }
