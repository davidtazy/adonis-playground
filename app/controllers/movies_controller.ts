import Movie from '#models/movie'
import MovieStatus from '#models/movie_status'
import MovieService from '#services/movie_service'
import { movieFilterValidator } from '#validators/movies_filter'
import type { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'
import querystring from 'node:querystring'

export default class MoviesController {
  async index({ request, view, auth }: HttpContext) {
    const filters = await movieFilterValidator.validate(request.qs())

    const page = request.input('page', 1) as number

    const movies = await MovieService.getFiltered(filters, page, auth.user)
    const movieStatuses = await MovieStatus.query().orderBy('name').select('id', 'name')
    const movieSortOptions = MovieService.sortOptions
    const qs = querystring.stringify(filters)

    movies.baseUrl(router.makeUrl('movies.index'))

    return view.render('pages/movies/index', {
      movies,
      movieStatuses,
      movieSortOptions,
      filters,
      qs,
    })
  }

  async show({ view, params }: HttpContext) {
    const movie = await Movie.findByOrFail('slug', params.slug)

    const cast = await movie.related('castMembers').query().orderBy('pivot_sort_order')
    const crew = await movie
      .related('crewMembers')
      .query()
      .pivotColumns(['title', 'sort_order'])
      //.wherePivot('title', 'Sound Mixer')
      .orderBy('pivot_sort_order')

    await movie.load('director')
    await movie.load('writer')
    return view.render('pages/movies/show', { movie, cast, crew })
  }
}
