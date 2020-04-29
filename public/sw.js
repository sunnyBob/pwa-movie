const CACHE_VERSION = 'cache_v1'

const cacheURL = [
  '/',
  '/manifest.json',
  '/favicon.ico ',
  '/images/icon-128.png',
  '/images/icon-144.png',
  '/images/icon-256.png',
  '/js/main.js',
  '/js/registerSw.js',
  '/style/movie.css ',
]

async function installFunc() {
  console.log('installing...')
  const cache  = await caches.open(CACHE_VERSION)
  await cache.addAll(cacheURL)
  await self.skipWaiting() // 跳过等待旧 sw 控制的所有页面都关闭了才 activate
}

async function activateFunc() {
  console.log('activating...')
  const cached = await caches.keys()
  cached.forEach(cache => {
    cache !== CACHE_VERSION && caches.delete(cache)
  })
  await self.clients.claim() // 立即取得页面控制权
}

async function fetchFunc(e) {
  const req = e.request
  const url = new URL(req.url)

  if (url.origin !== location.origin) return

  if (url.pathname.startsWith('/api')) {
    e.respondWith(networkFirst(req))
  } else {
    e.respondWith(cacheFirst(req))
  }
}

async function cacheFirst(req) {
  console.log('cacheFirst')
  console.log(req)
  const cached = await caches.match(req)

  if (cached) return cached

  const cloneReq = req.clone()
  const res = await fetch(cloneReq)
  const cache = await caches.open(CACHE_VERSION)

  if (cache) cache.put(req, res)

  return res
}

async function networkFirst(req) {
  console.log('networkFirst')
  try {
    const res = await fetch(req)
    const cache = await caches.open(CACHE_VERSION)
    if (cache) cache.put(req, res.clone())
    return res
  } catch (e) {
    const cached = await caches.match(req)
    return cached
  }
}

self.addEventListener('install', installFunc)
self.addEventListener('activate', activateFunc)
self.addEventListener('fetch', fetchFunc)
