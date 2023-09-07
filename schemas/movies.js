const z = require('zod')

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'tipo invalido se esperaba una cadena de texto',
    required_error: 'El titulo es requerido'
  }),
  year: z.number({
    invalid_type_error: 'debe ser un numero',
    required_error: 'este campo es requerido'
  }).int().min(1900).max(2024),
  director: z.string(),
  duration: z.number().positive().int(),
  poster: z.string().url(),
  genre: z.array(z.enum(['Action', 'Crime', 'Drama', 'Adventure', 'Sci-Fi', 'Crime', 'Romance', 'Biography', 'Fantasy', 'Thiller', 'Horror', 'Comedy']),
    {
      required_error: 'El genero es requerido',
      invalid_type_error: 'no exite el genero enviado'
    }),
  rate: z.number().min(0).max(10)

})

function validateMovie (object) {
  return movieSchema.safeParse(object)
}
function validateMoviePartial (object) {
  return movieSchema.partial().safeParse(object)
}

module.exports = {
  validateMovie,
  validateMoviePartial
}
