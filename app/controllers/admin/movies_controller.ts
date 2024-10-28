import Movie from '#models/movie'
import MovieService from '#services/movie_service'
import { movieValidator } from '#validators/movie'
import type { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'

export default class MoviesController {
  /**
   * Display a list of resource
   */
  async index({ request, view, auth }: HttpContext) {
    const page = request.input('page', 1)
    const movies = await Movie.query()
      .preload('status')
      .preload('director')
      .preload('writer')
      .if(auth.user, (query) =>
        query.preload('watchlist', (watchlist) => watchlist.where('userId', auth.user!.id))
      )
      .withCount('castMembers')
      .withCount('crewMembers')
      .orderBy('updatedAt', 'desc')
      .paginate(page, 10)

    movies.baseUrl(router.makeUrl('admin.movies.index'))

    return view.render('pages/admin/movies/index', { movies })
  }

  /**
   * Display form to create a new record
   */
  async create({ view }: HttpContext) {
    const data = await MovieService.getFormData()
    return view.render('pages/admin/movies/createOrUpdate', data)
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(movieValidator)
    await Movie.create(data)
    return response.redirect().toRoute('admin.movies.index')
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {}

  /**
   * Edit individual record
   */
  async edit({ params, view }: HttpContext) {
    const movie = await Movie.findOrFail(params.id)
    const data = await MovieService.getFormData()
    return view.render('pages/admin/movies/createOrUpdate', { movie: movie, ...data })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    const data = await request.validateUsing(movieValidator)
    const movie = await Movie.findOrFail(params.id)
    movie.merge(data).save()

    return response.redirect().toRoute('admin.movies.index')
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}
