document.addEventListener('DOMContentLoaded', () => {
  const catalogList = document.getElementById('catalog-list');
  const pagination = document.getElementById('pagination');
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get('search');
  let currentPage = 1;

  function loadCatalog(page, genre = 'all') {
    currentGenre = genre;
    fetch(`http://YOUR_PUBLIC_API_URL_HERE/api/catalog?page=${page}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          catalogList.innerHTML = `<p>${data.error}</p>`;
          return;
        }

        catalogList.innerHTML = ''; // Clear previous list

        data.Series.forEach(anime => {
          const animeItem = document.createElement('div');
          animeItem.classList.add('anime-item');

          const link = document.createElement('a');
          link.href = `anime.html?id=${anime.Id}`;

          const title = document.createElement('h3');
          title.textContent = anime.Title;
          title.classList.add('title');

          const image = document.createElement('img');
          image.src = anime.Image;
          image.alt = anime.Title;

          link.appendChild(image);
          link.appendChild(title);
          animeItem.appendChild(link);
          catalogList.appendChild(animeItem);
        });

        // Pagination
        pagination.innerHTML = '';
        if (currentPage > 1) {
          const prevButton = document.createElement('button');
          prevButton.textContent = 'Previous';
          prevButton.classList.add('nav-button');
          prevButton.addEventListener('click', () => {
            currentPage--;
            loadCatalog(currentPage);
          });
          pagination.appendChild(prevButton);
        }

        if (currentPage < data.Pages.last) {
          const nextButton = document.createElement('button');
          nextButton.textContent = 'Next';
          nextButton.classList.add('nav-button');
          nextButton.addEventListener('click', () => {
            currentPage++;
            loadCatalog(currentPage);
          });
          pagination.appendChild(nextButton);
        }
        window.scrollTo(0, 0); // Scroll to top after loading new content
      });
  }

  function loadSearchResults(query) {
    fetch(`http://YOUR_PUBLIC_API_URL_HERE/api/search?q=${query}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          catalogList.innerHTML = `<p>${data.error}</p>`;
          return;
        }

        catalogList.innerHTML = ''; // Clear previous list
        pagination.innerHTML = ''; // Clear pagination

        if (data.length === 0) {
          catalogList.innerHTML = '<p>No results found.</p>';
          return;
        }

        data.forEach(anime => {
          const animeItem = document.createElement('div');
          animeItem.classList.add('anime-item');

          const link = document.createElement('a');
          link.href = `anime.html?id=${anime.Id}`;

          const title = document.createElement('h3');
          title.textContent = anime.Title;
          title.classList.add('title');

          const image = document.createElement('img');
          image.src = anime.Image;
          image.alt = anime.Title;

          link.appendChild(image);
          link.appendChild(title);
          animeItem.appendChild(link);
          catalogList.appendChild(animeItem);
        });
      });
  }

  if (searchQuery) {
    loadSearchResults(searchQuery);
  } else {
    loadCatalog(currentPage);
  }
});