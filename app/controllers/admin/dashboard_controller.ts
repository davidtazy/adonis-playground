import Cineast from '#models/cineast'
import Movie from '#models/movie'
import type { HttpContext } from '@adonisjs/core/http'

export default class DashboardController {
  async handle({ view }: HttpContext) {
    const moviesCount = await Movie.query().count('id').firstOrFail()

    const writersCount = await Cineast.query()
      .whereHas('moviesWritten', (query) => query)
      .count('id')
      .firstOrFail()

    const directorsCount = await Cineast.query()
      .whereHas('moviesDirected', (query) => query)
      .count('id')
      .firstOrFail()

    return view.render('pages/admin/dashboard', {
      moviesCount,
      writersCount,
      directorsCount,
    })
  }
}
