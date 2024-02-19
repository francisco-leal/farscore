import type { HttpContext } from '@adonisjs/core/http'
import { FrameRequest, getFrameMessage } from '@coinbase/onchainkit';
import { User } from '#models/user';


export default class FramesController {
  async index({ view }: HttpContext) {
    const fid = 195255;

    const user = await User.query().where('fid', fid).first();

    if (!user) {
      console.log("No user found")
      return view.render('pages/error');
    }

    return view.render('pages/score', { score: user.score, fid: user.fid })
  }

  async store({ view, request }: HttpContext) {
    const body = request.body() as FrameRequest;

    const { isValid, message } = await getFrameMessage(body , {
      neynarApiKey: process.env.NEYNAR_API_KEY,
    });

    if (!isValid) {
      console.log("Invalid frame message")
      return view.render('pages/error');
    }

    const { fid } = message.interactor;

    const user = await User.query().where('fid', fid).first();

    if (!user) {
      console.log("No user found")
      return view.render('pages/error');
    }

    return view.render('pages/score', { score: user.score, fid: user.fid })
  }

  async main({ view, request }: HttpContext) {
    const body = request.body() as FrameRequest;

    const { isValid, message } = await getFrameMessage(body , {
      neynarApiKey: process.env.NEYNAR_API_KEY,
    });

    if (!isValid) {
      console.log("Invalid frame message")
      return view.render('pages/error');
    }

    const { fid } = message.interactor;
    
    if(message.button === 1) {
      // search
      return view.render('pages/search')
    } else if (message.button === 2) {
      // leaderboard
      const topUsers = await User.query().where('score', '>', 0).orderBy('score', 'desc').limit(5);
      return view.render('pages/leaderboard', { topUsers })
    } else if (message.button === 3) {
      // top followers
      const user = await User.query().where('fid', fid).first();
      const topUsers = await User.query().where('score', '>', 0).orderBy('score', 'desc').limit(5);
      return view.render('pages/top_followers', { topUsers, user })
    }
  };

  async followers({ view, request }: HttpContext) {
    const body = request.body() as FrameRequest;

    const { isValid, message } = await getFrameMessage(body , {
      neynarApiKey: process.env.NEYNAR_API_KEY,
    });

    if (!isValid) {
      console.log("Invalid frame message")
      return view.render('pages/error');
    }

    const { fid } = message.interactor;
    
    if(message.button === 1) {
      // my score
      const user = await User.query().where('fid', fid).first();

      if (!user) {
        console.log("No user found")
        return view.render('pages/error');
      }

      return view.render('pages/score', { score: user.score, fid: user.fid })
    } else if (message.button === 2) {
      // leaderboard
      const topUsers = await User.query().where('score', '>', 0).orderBy('score', 'desc').limit(5);
      return view.render('pages/leaderboard', { topUsers })
    } else if (message.button === 3) {
      // search
      return view.render('pages/search')
    }
  };

  async leaderboard({ view, request }: HttpContext) {
    const body = request.body() as FrameRequest;

    const { isValid, message } = await getFrameMessage(body , {
      neynarApiKey: process.env.NEYNAR_API_KEY,
    });

    if (!isValid) {
      console.log("Invalid frame message")
      return view.render('pages/error');
    }

    const { fid } = message.interactor;
    
    if(message.button === 1) {
      // my score
      const user = await User.query().where('fid', fid).first();

      if (!user) {
        console.log("No user found")
        return view.render('pages/error');
      }

      return view.render('pages/score', { score: user.score, fid: user.fid })
    } else if (message.button === 2) {
      // top followers
      const topUsers = await User.query().where('score', '>', 0).orderBy('score', 'desc').limit(5);
      return view.render('pages/leaderboard', { topUsers })
    } else if (message.button === 3) {
      // search
      return view.render('pages/search')
    }
  };

  async search({ view, request }: HttpContext) {
    const body = request.body() as FrameRequest;

    const { isValid, message } = await getFrameMessage(body , {
      neynarApiKey: process.env.NEYNAR_API_KEY,
    });

    if (!isValid) {
      console.log("Invalid frame message")
      return view.render('pages/error');
    }

    const user = await User.findBy('username', message.input);

    if (!user) {
      console.log("No user found")
      return view.render('pages/error');
    }

    return view.render('pages/score', { score: user.score, fid: user.fid })
  };
}
