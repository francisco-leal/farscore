import type { HttpContext } from '@adonisjs/core/http'
import { User } from '#models/user';
import { Connection } from '#models/connection';

export default class FollowersController {
  async index({ view, request }: HttpContext) {
    if (request.parsedUrl.query?.includes('keyword')) {
      const keyword = request.parsedUrl.query.split('=')[1]
      const user = await User.query().where('username', keyword).first()
      
      if (!user) {
        return view.render('pages/error');
      }

      const connections = await Connection.query().where('target_fid', user.fid)
      const topUsers = await User.query().where('fid', 'in', connections.map((c) => c.sourceFid)).orderBy('score', 'desc').limit(5)

      return view.render('pages/leaderboard', {topUsers})
    }

    const topUsers = await User.query().where('score', '>', 0).orderBy('score', 'desc').limit(5);
    return view.render('pages/leaderboard', {topUsers})
  }
}
