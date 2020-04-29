const Router = require('koa-router')
const ctrl = require('../ctrl')
const router = new Router()

router.get('/api/movies', ctrl.getMovieList)

module.exports = router
