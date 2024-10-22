import Movie from '#models/movie'
import type { HttpContext } from '@adonisjs/core/http'

export default class MoviesController {
  async index({ view }: HttpContext) {
    const comingSoon = await Movie.query()
      .withScopes((scope) => scope.notReleased())
      .preload('director')
      .preload('writer')
      .whereNotNull('releasedAt')
      .orderBy('releasedAt', 'asc')
      .limit(3)

    const recentlyReleased = await Movie.query()
      .withScopes((scope) => scope.released())
      .preload('director')
      .preload('writer')
      .orderBy('releasedAt', 'desc')
      .limit(9)

    return view.render('pages/home', { recentlyReleased, comingSoon })
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
