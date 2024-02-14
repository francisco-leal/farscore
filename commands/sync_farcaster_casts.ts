import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

import { fetchCasts } from '#services/fetch_casts'
import { User } from '#models/user'
import { Cast } from '#models/cast'

export default class SyncFarcasterCasts extends BaseCommand {
  static commandName = 'sync:farcaster-casts'
  static description = 'Sync all farcaster casts via the warpcast api.'

  static options: CommandOptions = {
    startApp: true
  }

  async run() {
    this.logger.info('Starting sync of farcaster casts')

    let cursor = null
    let i = 0
    
    while(i < 10000) {
      this.logger.info(`Fetching page #${i++}`)
      const { data } = await fetchCasts(cursor)
      const casts = data.result.casts
      cursor = data.next?.cursor;

      if(!casts) { break };

      this.logger.info(`Got result from warpcast - ${casts.length} casts. Cursor: ${cursor}`)

      for(const cast of casts) {
        let user = await User.findBy('fid', cast.author.fid)
        if (!user) {
          this.logger.info(`Creating user ${cast.author.username}`)
          user = new User()
          user.fid = cast.author.fid
        }
        user.username = cast.author.username
        user.displayName = cast.author.displayName
        user.profilePictureUrl = cast.author.pfp?.url
        user.follower_count = cast.author.followerCount || 0
        user.following_count = cast.author.followingCount || 0
        user.active_farcaster_badge = !!cast.author.activeOnFcNetwork
        await user.save()

        let newCast = await Cast.findBy('castHash', cast.hash)
        if (!newCast) {
          newCast = new Cast()
          newCast.castHash = cast.hash
        }
        newCast.content = cast.text
        newCast.parentCastHash = cast.parentHash
        newCast.replies_count = cast.replies.count
        newCast.recasts_count = cast.recasts.count
        newCast.watches_count = cast.watches.count
        newCast.quotes_count = cast.quoteCount
        newCast.timestamp = cast.timestamp
        newCast.userId = user.id
        await newCast.save()
      }

      if (!cursor) { break }
    }
  }
}