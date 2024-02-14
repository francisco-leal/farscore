import type { HttpContext } from '@adonisjs/core/http'
import { calculateScore } from '#services/calculate_score';

export default class FramesController {
  async index({ view }: HttpContext) {
    const score = await calculateScore(1);
    return view.render('pages/score', { score })
  }

  async store({ view }: HttpContext) {
    const score = await calculateScore(100);
    return view.render('pages/score', { score })
  }
}
