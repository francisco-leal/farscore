import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

import { fetchCasts } from '#services/fetch_casts'

export default class SyncFarcasterCasts extends BaseCommand {
  static commandName = 'sync:farcaster-casts'
  static description = ''

  static options: CommandOptions = {}

  async run() {
    this.logger.info('Starting sync of farcaster casts')

    const result = await fetchCasts();

    console.log(result);
  }
}