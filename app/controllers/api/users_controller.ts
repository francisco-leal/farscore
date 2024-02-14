import type { HttpContext } from '@adonisjs/core/http'
import { User } from '#models/user';

export default class APIUsersController {
  /**
   * Return list of all users or paginate through them
   */
  async index({}: HttpContext) {
    const users = User.all()
    return users;
  }

  /**
   * Display a single user by id.
   */
  async show({params }: HttpContext) {
    const user = User.findBy('fid', params.id);
    return user;
  }
}