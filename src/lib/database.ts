import { debug } from 'console'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import path from 'path'
import { TData, TWriteDataKey } from '../types/database.types'

export class Database {
  private readonly file = path.join(process.cwd(), 'db.json')
  private readonly adapter = new JSONFile<TData>(this.file)
  private readonly defaultData: TData = {
    searchResult: [],
    playingnow: null,
    lastSearchQuery: '',
    lastPlayed: null,
  }

  private readonly db = new Low<TData>(this.adapter, this.defaultData)

  constructor() {}

  async write<K extends TWriteDataKey>(field: K, data: TData[K]) {
    try {
      await this.db.read()
      this.db.data[field] = data
      await this.db.write()
    } catch (error) {
      debug((error as Error).message)
    }
  }

  async read<K extends TWriteDataKey>(field: K) {
    try {
      await this.db.read()

      return this.db.data[field]
    } catch (error) {
      debug((error as Error).message)
    }
  }
}
