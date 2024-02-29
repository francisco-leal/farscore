import { args, BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { User } from '#models/user'
import { Connection } from '#models/connection'
import { fetchFollowersWarpcast } from '#services/fetch_casts'

export default class SyncFarcasterFollowers extends BaseCommand {
  static commandName = 'sync:farcaster-followers'
  static description = 'Sync all follower connections based on airstack data.'

  static options: CommandOptions = {
    startApp: true,
  }

  @args.string()
  declare farcasterId: string

  async run() {
    this.logger.info('syncing farcaster followers...')

    let users

    if (this.farcasterId !== '-1') {
      users = await User.query().where('id', '<=', this.farcasterId).orderBy('id', 'desc')
    } else {
      users = await User.query().orderBy('id', 'desc')
    }

    this.logger.info(`users: ${users.length}`)

    for (let user of users) {
      this.logger.info(`Processing followers for ${user.username} - ${user.fid} | ${user.id}`)
      let cursor = null
      while (true) {
        const { data } = await fetchFollowersWarpcast(user.fid, cursor)
        const userFollowers = data.result.users
        cursor = data.next?.cursor

        if (!userFollowers) {
          break
        }

        this.logger.info(
          `Got result from warpcast - ${userFollowers.length} followers. Cursor: ${cursor} - next cursor: ${data.next?.cursor}`
        )

        for (const userFollowing of userFollowers) {
          let connection = await Connection.query()
            .where('target_fid', user.fid)
            .where('source_fid', userFollowing.fid)
            .first()
          if (!connection) {
            connection = new Connection()
            connection.targetFid = user.fid
            connection.sourceFid = userFollowing.fid
            connection.dappName = 'farcaster'
            await connection.save()
          }
        }

        if (userFollowers.length < 1000 || !cursor) {
          break
        }
      }
    }
  }
}
