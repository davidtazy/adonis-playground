import Movie from '#models/movie'
import type { HttpContext } from '@adonisjs/core/http'

export default class MoviesController {
  async index({ view }: HttpContext) {
    const movies = await Movie.query()

      .preload('director')
      .preload('writer')
      .orderBy('title', 'asc')
      .limit(15)

    return view.render('pages/movies/index', { movies })
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
