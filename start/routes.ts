/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import FramesController from '#controllers/frames_controller'

const APICastsController = () => import('#controllers/api/casts_controller')
const APIUsersController = () => import('#controllers/api/users_controller')
const ImagesController = () => import('#controllers/images_controller')
const LeaderboardController = () => import('#controllers/leaderboard_controller')
const SearchController = () => import('#controllers/search_controller')
const FollowersController = () => import('#controllers/followers_controller')

router.on('/').render('pages/home')
router.resource('api/casts', APICastsController).only(['index', 'show'])
router.resource('api/users', APIUsersController).only(['index', 'show'])
router.resource('generated_images', ImagesController).only(['show'])
router.resource('leaderboard', LeaderboardController).only(['index', 'store'])
router.resource('search', SearchController).only(['index'])
router.resource('followers', FollowersController).only(['index'])

router.post('frames/main', [FramesController, 'main'])
router.post('frames/followers', [FramesController, 'followers'])
router.post('frames/leaderboard', [FramesController, 'leaderboard'])
router.post('frames/search', [FramesController, 'search'])
router.post('frames/score', [FramesController, 'score'])
router.get('frames', [FramesController, 'index'])
