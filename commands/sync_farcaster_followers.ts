import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { User } from '#models/user'
import { Connection } from '#models/connection'
import { fetchFollowersWarpcast } from '#services/fetch_casts'

export default class SyncFarcasterFollowers extends BaseCommand {
  static commandName = 'sync:farcaster-followers'
  static description = 'Sync all follower connections based on airstack data.'

  static options: CommandOptions = {
    startApp: true
  }

  async run() {
    this.logger.info('syncing farcaster followers...')
    let page = 1

    while(true) {
      // const users = await User.query().where('id', '<=', 85817).orderBy('id', "desc").forPage(page, 100)
      const users = await User.query().where('fid', 'in', [195255, 3, 2, 221216, 8446])

      if(!users || users.length === 0) {
        break;
      }
      this.logger.info(`changing page to: ${page}, users: ${users.length}`);
      page += 1;

      for(let user of users) {
        this.logger.info(`Processing ${user.follower_count} followers for ${user.username}`)
        let cursor = null

        while(true) {
          const { data } = await fetchFollowersWarpcast(user.fid, cursor)
          const userFollowers = data.result.users
          cursor = data.next?.cursor;

          if(!userFollowers || !cursor) { break };

          this.logger.info(`Got result from warpcast - ${userFollowers.length} followers. Cursor: ${cursor} - next cursor: ${data.next?.cursor}`)

          for(const userFollowing of userFollowers) {
            let connection = await Connection.query().where('target_fid', user.fid).where('source_fid', userFollowing.fid).first()
            if (!connection) {
              connection = new Connection()
              connection.targetFid = user.fid
              connection.sourceFid = userFollowing.fid
              connection.dappName = 'farcaster'
              await connection.save()
            }
          }
        }
      }
    }
  }
}
