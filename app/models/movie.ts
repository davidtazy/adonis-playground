import cache from '#services/cache_service'
import MovieService from '#services/movie_service'
import { toHtml } from '@dimerapp/markdown/utils'

export default class Movie {
  declare slug: string
  declare title: string
  declare summary: string
  declare abstract?: string

  static async all() {
    const slugs = await MovieService.getSlugs()

    const movies: Movie[] = []
    for (const slug of slugs) {
      const movie = await this.find(slug)
      movies.push(movie)
    }
    return movies
  }

  static async find(slug: string): Promise<Movie> {
    if (cache.has(slug)) {
      console.log(`Cache hit${slug}`)
      return cache.get(slug)
    }

    const md = await MovieService.read(slug)
    const movie = new Movie()
    movie.title = md.frontmatter.title
    movie.summary = md.frontmatter.summary
    movie.slug = slug
    movie.abstract = toHtml(md).contents

    cache.set(slug, movie)

    return movie
  }
}
