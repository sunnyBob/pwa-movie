
const newMovies = require('../db/new')
const highScore = require('../db/highScore')

exports.getMovies = function(type) {
  const listMapper = {
    new: JSON.parse(newMovies).subjects,
    highScore: JSON.parse(highScore).subjects,
  }
  const list = listMapper[type]
  const result = new Set()

  if (!list) return []

  while(result.size < 20) {
    const randomIndex = parseInt(Math.random() * 50, 10)
    result.add(list[randomIndex])
  }

  return [...result]
}
