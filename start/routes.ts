/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const APICastsController = () => import('#controllers/api/casts_controller')
const APIUsersController = () => import('#controllers/api/users_controller')

router.on('/').render('pages/home')
router.resource('api/casts', APICastsController).only(['index', 'show'])
router.resource('api/users', APIUsersController).only(['index', 'show'])