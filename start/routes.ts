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
const FramesController = () => import('#controllers/frames_controller')
const ImagesController = () => import('#controllers/images_controller')

router.on('/').render('pages/home')
router.resource('api/casts', APICastsController).only(['index', 'show'])
router.resource('api/users', APIUsersController).only(['index', 'show'])
router.resource('frames', FramesController).only(['index', 'store'])
router.resource('generated_images', ImagesController).only(['show'])
