import { TVideo } from './entities.types'

export interface TData {
  searchResult: Array<TVideo>
  playingnow: TVideo | null
  lastSearchQuery: string
  lastPlayed: TVideo | null
}

export type TWriteDataKey = keyof TData
