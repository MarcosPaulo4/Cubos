import { AppDataSource } from '../data-source'
import { Genre } from '../entities/gender.entity'

const initialGenres = [
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Fantasy',
  'Science Fiction',
  'Horror',
  'Romance',
  'Animation',
  'Documentary',
]

async function seedGenres() {
  await AppDataSource.initialize()
  console.log('Database connected — starting seed...')

  const genreRepo = AppDataSource.getRepository(Genre)

  for (const name of initialGenres) {
    const exists = await genreRepo.findOne({ where: { name } })
    if (!exists) {
      const entity = genreRepo.create({ name })
      await genreRepo.save(entity)
      console.log(`Genre inserted: ${name}`)
    } else {
      console.log(`Genre already exists: ${name}`)
    }
  }

  await AppDataSource.destroy()
  console.log('Seed finished!')
}

seedGenres().catch((err) => {
  console.error('Error running seed:', err)
  AppDataSource.destroy()
})
