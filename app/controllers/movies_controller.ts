import Movie from '#models/movie'
import type { HttpContext } from '@adonisjs/core/http'

export default class MoviesController {
  async index({ request, view }: HttpContext) {
    const qs = request.qs()

    const movies = await Movie.query()
      .if(qs.search, (query) => {
        query.whereILike('title', `%${qs.search}%`)
      })
      .preload('director')
      .preload('writer')
      .orderBy('title', 'asc')
      .limit(15)

    return view.render('pages/movies/index', { movies, filter: qs })
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
