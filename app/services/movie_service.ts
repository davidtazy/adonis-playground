import Cineast from '#models/cineast'
import MovieStatus from '#models/movie_status'
import { Exception } from '@adonisjs/core/exceptions'
import app from '@adonisjs/core/services/app'
import { MarkdownFile } from '@dimerapp/markdown'
import { readdir, readFile } from 'node:fs/promises'

export default class MovieService {
  static async getSlugs(): Promise<string[]> {
    const files = await readdir(app.makeURL('resources/movies'))

    return files.map((file) => file.replace('.md', ''))
  }

  static async read(slug: string): Promise<MarkdownFile> {
    try {
      const filename = `${slug}.md`
      const url = app.makeURL(`resources/movies/${filename}`)
      const file = await readFile(url, 'utf8')
      const md = new MarkdownFile(file)
      await md.process()
      return md
    } catch (error) {
      throw new Exception(`could not find movie called ${slug}`, {
        code: 'E_NOT_FOUND',
        status: 404,
      })
    }
  }

  static async getFormData() {
    const statuses = await MovieStatus.query().orderBy('name')
    const cineasts = await Cineast.query().orderBy('lastName')
    return { statuses, cineasts }
  }
}
