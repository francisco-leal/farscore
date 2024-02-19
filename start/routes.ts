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
const LeaderboardController = () => import('#controllers/leaderboard_controller')

router.on('/').render('pages/home')
router.resource('api/casts', APICastsController).only(['index', 'show'])
router.resource('api/users', APIUsersController).only(['index', 'show'])
router.resource('generated_images', ImagesController).only(['show'])
router.resource('leaderboard', LeaderboardController).only(['index', 'store'])

router.resource('frames', FramesController).only(['index', 'store'])
router.post('frames/main', 'FramesController.main')
router.post('frames/followers', 'FramesController.followers')
router.post('frames/leaderboard', 'FramesController.leaderboard')
router.post('frames/search', 'FramesController.search')
