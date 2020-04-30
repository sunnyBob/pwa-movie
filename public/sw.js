const CACHE_VERSION = 'cache_v1'
const cacheURL= [
  '/',
  '/images/icon-128.png',
  '/images/icon-144.png',
  '/images/icon-256.png',
  '/js/main.js',
  '/favicon.ico',
  '/manifest.json',
  '/style/movie.css',
]

async function installFunc() {
  console.log('install')

  const cache = await caches.open(CACHE_VERSION)
  await cache.addAll(cacheURL)

  await skipWaiting()
}

async function activateFunc() {
  console.log('activate')

  const keys = await caches.keys()
  await Promise.all(keys.map(async key => {
    if (key !== CACHE_VERSION) {
      await caches.delete(key)
    }
  }))
  await clients.claim()
}

function fetchFunc(e) {
  const req = e.request
  const url = new URL(req.url)

  if (url.origin !== location.origin) return

  const strategy = new Strategy()

  if (url.pathname.startsWith('/api')) {
    e.respondWith(strategy.networkFirst(req))
  } else {
    e.respondWith(strategy.cacheFirst(req))
  }
}

function Strategy() {
  this.cacheFirst = async function(req) {
    const cached = await caches.match(req)

    if (cached) return cached

    const res = await fetch(req)

    if (res.status !== 200) return res

    const cache = await caches.open(CACHE_VERSION)

    await cache.put(req, res.clone())
    return res
  }

  this.networkFirst = async function(req) {
    try {
      const res = await fetch(req)

      if (res.status !== 200) return res

      const cache = await caches.open(CACHE_VERSION)

      await cache.put(req, res.clone())
      return res
    } catch(e) {
      const cached = await caches.match(req)
      if (cached) return cached
    }
  }
}

self.addEventListener('install', installFunc)
self.addEventListener('activate', activateFunc)
self.addEventListener('fetch', fetchFunc)
