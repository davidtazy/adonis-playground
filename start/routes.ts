/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const WatchlistsController = () => import('#controllers/watchlists_controller')
const HomeController = () => import('#controllers/home_controller')
const AdminDashboardController = () => import('#controllers/admin/dashboard_controller')
const AdminMoviesController = () => import('#controllers/admin/movies_controller')

const LogoutController = () => import('#controllers/auth/logout_controller')

const WritersController = () => import('#controllers/writers_controller')
const RegisterController = () => import('#controllers/auth/register_controller')
const LoginController = () => import('#controllers/auth/login_controller')
const RedisController = () => import('#controllers/redis_controller')
const MoviesController = () => import('#controllers/movies_controller')
const DirectorsController = () => import('#controllers/directors_controller')

router.get('/', [HomeController, 'index']).as('home')

router.get('/movies', [MoviesController, 'index']).as('movies.index')

router
  .get('/movies/:slug', [MoviesController, 'show'])
  .as('movies.show')
  .where('slug', router.matchers.slug())

router
  .post('/watchlists/:movieId/toggle', [WatchlistsController, 'toggle'])
  .as('watchlists.toggle')
  .use(middleware.auth())

router.get('/directors/:id', [DirectorsController, 'show']).as('directors.show')
router.get('/directors', [DirectorsController, 'index']).as('directors.index')

router.get('/writers/:id', [WritersController, 'show']).as('writers.show')
router.get('/writers', [WritersController, 'index']).as('writers.index')

// flush is first because it would be treated as a valid slug (route are tested in order)
router.delete('/redis/flush', [RedisController, 'flush']).as('redis.flush')
router.delete('/redis/:slug', [RedisController, 'destroy']).as('redis.destroy')

router
  .group(() => {
    router.get('register', [RegisterController, 'show']).as('register.show').use(middleware.guest())

    router
      .post('register', [RegisterController, 'store'])
      .as('register.store')
      .use(middleware.guest())

    router.get('login', [LoginController, 'show']).as('login.show').use(middleware.guest())
    router.post('login', [LoginController, 'store']).as('login.store').use(middleware.guest())

    router.post('/logout', [LogoutController, 'handle']).as('logout').use(middleware.auth())
  })
  .prefix('/auth')
  .as('auth')

router
  .group(() => {
    router.get('/', [AdminDashboardController, 'handle']).as('dashboard')

    router.resource('movies', AdminMoviesController)
    //router.get('/movies', [AdminMoviesController, 'index']).as('movies.index')
    //router.get('/create', [AdminMoviesController, 'create']).as('movie.create')
  })
  .prefix('/admin')
  .as('admin')
  .use(middleware.admin())
