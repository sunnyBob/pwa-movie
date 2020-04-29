window.onload = function() {
  const btnFilter = document.querySelector('.btn-filter')

  fetchMovies('new')

  btnFilter.onclick = function(e) {
    const target = e.target

    if (target.tagName !== 'BUTTON') return

    const sibling = target.previousElementSibling || target.nextElementSibling

    sibling.classList.remove('btn-success')
    target.classList.add('btn-success')

    const { type } = target.dataset

    fetchMovies(type)
  }

  function renderMoviesCard(movies) {
    return movies.map(({ title, cover, rate }) => `
      <div class="movie-card">
        <div class="movie-card card">
          <img class="card-img-top" src="${cover}" alt="${title}" />
          <div class="card-body">
            <h4 class="card-title">${title}</h4>
            <div class="star-rate">
              <span class="score card-footer-badge float-right badge badge-primary badge-pill">
                <i class="fa fa-star-o fa-lg"></i>
                ${rate}
              </span>
            </div>
          </div>
        </div>
      </div>
    `).join('')
  }

  async function fetchMovies(type) {
    const movies = await axios.get(`/api/movies?type=${type}`).then(res =>  res.data)

    document.querySelector('.card-deck').innerHTML = renderMoviesCard(movies)
  }
}
