import Movie from '#models/movie'
import MovieService from '#services/movie_service'
import { movieValidator } from '#validators/movie'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import router from '@adonisjs/core/services/router'
import db from '@adonisjs/lucid/services/db'
import { unlink } from 'node:fs/promises'

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
    const { poster, crew, cast, ...data } = await request.validateUsing(movieValidator)

    if (poster) {
      data.posterUrl = await MovieService.storePosterUrl(poster)
    }

    await db.transaction(async (trx) => {
      const movie = await Movie.create(data, { client: trx })
      await MovieService.syncCastAndCrew(movie, crew, cast)
    })

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

    const crewMembers = await db
      .from('crew_movies')
      .where('movie_id', movie.id)
      .orderBy('sort_order')

    const castMembers = await db
      .from('cast_movies')
      .where('movie_id', movie.id)
      .orderBy('sort_order')

    return view.render('pages/admin/movies/createOrUpdate', {
      movie,
      ...data,
      crewMembers,
      castMembers,
    })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    const { crew, cast, poster, ...data } = await request.validateUsing(movieValidator)
    const movie = await Movie.findOrFail(params.id)

    if (poster) {
      data.posterUrl = await MovieService.storePosterUrl(poster)
    } else if (!data.posterUrl && movie.posterUrl) {
      await unlink(app.makePath('storage', movie.posterUrl))
      data.posterUrl = ''
    }

    await db.transaction(async (trx) => {
      movie.useTransaction(trx)
      await movie.merge(data).save()
      await MovieService.syncCastAndCrew(movie, crew, cast)
    })

    return response.redirect().toRoute('admin.movies.index')
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const movie = await Movie.findOrFail(params.id)

    await movie.delete()

    return response.redirect().back()
  }
}
