
function registerSw() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).then(registration => {
      console.log('注册成功🥰')
    }).catch(err => {
      console.log(err)
      console.log('注册失败🥶')
    })
  } else {
    console.log('Your browser not support sw')
  }
}

window.addEventListener('load', registerSw)
