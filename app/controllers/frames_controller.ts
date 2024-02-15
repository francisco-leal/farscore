import type { HttpContext } from '@adonisjs/core/http'
import { FrameRequest, getFrameMessage } from '@coinbase/onchainkit';
import { User } from '#models/user';


export default class FramesController {
  async store({ view, request }: HttpContext) {
    const body = request.body() as FrameRequest;

    const { isValid, message } = await getFrameMessage(body , {
      neynarApiKey: process.env.NEYNAR_API_KEY,
    });

    if (!isValid) {
      return view.render('pages/error');
    }

    const { fid } = message.interactor;

    const user = await User.query().where('fid', fid).first();

    if (!user) {
      return view.render('pages/error');
    }

    return view.render('pages/score', { score: user.score })
  }
}
