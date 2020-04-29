const api = require('../api')

exports.getMovieList = function(ctx) {
  const { type = 'new' } = ctx.query
  const movies= api.getMovies(type)

  ctx.body = movies
}
