const https = require('https')
const fs = require('fs')
const path = require('path')
const bodyParser = require('koa-bodyparser')
const static = require('koa-static')
const Koa = require('koa')
const app = new Koa()
const router = require('./routes')

const PRIVATE_KEY = fs.readFileSync(path.resolve(process.cwd(), 'certs/key.pem'), 'utf8').toString()
const CERT = fs.readFileSync(path.resolve(process.cwd(), 'certs/cert.pem'), 'utf8').toString()
const PORT = 3001

app.use(bodyParser())
app.use(static('./public'))
app.use(router.routes())

https.createServer({
  key: PRIVATE_KEY,
  cert: CERT,
}, app.callback()).listen(PORT)

app.on('error', err => {
  log.error('server error', err)
});
