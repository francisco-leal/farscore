import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { User } from '#models/user'
import { Connection } from '#models/connection'
import { fetchFollowers } from '#services/fetch_followers'

export default class SyncFarcasterFollowers extends BaseCommand {
  static commandName = 'sync:farcaster-followers'
  static description = 'Sync all follower connections based on airstack data.'

  static options: CommandOptions = {
    startApp: true
  }

  async run() {
    this.logger.info('syncing farcaster followers...')

    let page = 1;
    while(true) {
      const users = await User.query().orderBy('id', "desc").forPage(page++, 100)

      if(users.length === 0) {
        break;
      }

      for(let user of users) {
        const { data } = await fetchFollowers(user.fid)
        const followers = data
        
        for(let follower of followers) {
          let connection = await Connection.query().where('target_fid', user.fid).where('source_fid', follower.followerProfileId).first()
          if (!connection) {
            connection = new Connection()
            connection.targetFid = user.fid
            connection.sourceFid = follower.followerProfileId
            connection.dappName = 'farcaster'
            await connection.save()
          }
        }
      }
    }
  }
}
