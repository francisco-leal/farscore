import type { HttpContext } from '@adonisjs/core/http'

export default class FramesController {
  async index({ view }: HttpContext) {
    const score = 100;
    return view.render('pages/score', { score })
  }

  async store({ view }: HttpContext) {
    const score = 100;
    return view.render('pages/score', { score })
  }
}
