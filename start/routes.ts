/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const RedisController = () => import('#controllers/redis_controller')
const MoviesController = () => import('#controllers/movies_controller')
const DirectorsController = () => import('#controllers/directors_controller')

router.get('/', [MoviesController, 'index']).as('home')

router
  .get('/movies/:slug', [MoviesController, 'show'])
  .as('movies.show')
  .where('slug', router.matchers.slug())

router.get('/directors/:id', [DirectorsController, 'show']).as('directors.show')
router.get('/directors', [DirectorsController, 'index']).as('directors.index')

// flush is first because it would be treated as a valid slug (route are tested in order)
router.delete('/redis/flush', [RedisController, 'flush']).as('redis.flush')
router.delete('/redis/:slug', [RedisController, 'destroy']).as('redis.destroy')
