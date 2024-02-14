import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

import { fetchCasts } from '#services/fetch_casts'
import { User } from '#models/user'
import { Cast } from '#models/cast'

export default class SyncFarcasterCasts extends BaseCommand {
  static commandName = 'sync:farcaster-casts'
  static description = ''

  static options: CommandOptions = {}

  async run() {
    this.logger.info('Starting sync of farcaster casts')

    let cursor = null
    let i = 0
    
    while(true) {
      this.logger.info(`Fetching page #${i++}`);
      const { data } = await fetchCasts(cursor)

      if (!cursor) { break }
    }
  }
}