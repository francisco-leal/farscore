import type { HttpContext } from '@adonisjs/core/http'

export default class APICastsController {
  /**
   * Return list of all posts or paginate through them
   */
  async index({}: HttpContext) {
    return [{ id: 1, title: 'Cast 101' }, { id: 2, title: 'Cast 102' }];
  }

  /**
   * Display a single post by id.
   */
  async show({params }: HttpContext) {
    return { id: params.id, title: `Cast ${params.id}` };
  }
}
