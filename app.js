const express = require('express')
const cors = require('cors')
const movies = require('./movies.json')
const crypto = require('node:crypto')
const { validateMovie, validateMoviePartial } = require('./schemas/movies')

const PORT = process.env.PORT ?? 1234
const app = express()
app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:8080',
      'http://localhost:1234',
      'http://movies.com'
    ]
    if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
      return callback(null, true)
    }
    return callback(new Error('Not allowed by CORS'))
  }
}))
app.use(express.json())
app.disable('x-powered-by')

app.get('/movies', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  const { genre } = req.query
  if (genre) {
    const filteredMovies = movies.filter(
      movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase()))
    return res.json(filteredMovies)
  }
  res.json(movies)
})

app.get('/movies/:id', (req, res) => {
  const { id } = req.params
  const movie = movies.find(movie => movie.id === id)
  if (movie) return res.json(movie)
  res.status(404).json({ message: 'Movie not found' })
})

app.post('/movies', (req, res) => {
  const result = validateMovie(req.body)
  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data
  }

  movies.push(newMovie)

  res.status(201).json(newMovie)
})

app.delete('/movies/:id', (req, res) => {
  const { id } = req.params
  const movieInd = movies.findIndex(movie => movie.id === id)
  if (movieInd === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }
  movies.splice(movieInd, 1)
  return res.json({ message: 'Movie delete' })
})

app.patch('/movies/:id', (req, res) => {
  const result = validateMoviePartial(req.body)
  if (!result.success) {
    return res.status(422).json({ error: JSON.parse(result.error) })
  }
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)
  if (movieIndex === -1) return res.status(404).json({ message: 'Movie not found' })

  const updateMovie = {
    ...movies[movieIndex],
    ...result.data
  }
  movies[movieIndex] = updateMovie
  return res.json(updateMovie)
})

app.listen(PORT, () => {
  console.log(`servidor escuchado en puerto: http://localhost:${PORT}`)
})
