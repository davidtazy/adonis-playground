/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { Exception } from '@adonisjs/core/exceptions'
import router from '@adonisjs/core/services/router'
import { toHtml } from '@dimerapp/markdown/utils'
import MovieService from '#services/movie_service'

router
  .get('/', async (ctx) => {
    const slugs = await MovieService.getSlugs()

    const movies: Record<string, any>[] = []
    for (const slug of slugs) {
      const md = await MovieService.read(slug)
      movies.push({
        title: md.frontmatter.title,
        summary: md.frontmatter.summary,
        slug: slug,
      })
    }

    return ctx.view.render('pages/home', { movies })
  })
  .as('home')

router
  .get('/movies/:slug', async (ctx) => {
    const md = await MovieService.read(ctx.params.slug)
    const movie = toHtml(md).contents
    return ctx.view.render('pages/movies/show', { movie, md })
  })
  .as('movies.show')
  .where('slug', router.matchers.slug())
