import axios from 'axios';
import Notiflix from 'notiflix';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

const apiKey = '39883816-7d1852f26e33bbb727bc03d19';
const perPage = 40;
let currentPage = 1;

searchForm.addEventListener('submit', async e => {
  e.preventDefault();
  const searchQuery = e.target.searchQuery.value.trim();

  if (searchQuery === '') {
    Notiflix.Notify.failure('Please enter a search query.');
    return;
  }

  currentPage = 1;
  gallery.innerHTML = '';

  searchImages(searchQuery, currentPage);
});

loadMoreButton.addEventListener('click', () => {
  currentPage++;
  const searchQuery = searchForm.searchQuery.value.trim();
  searchImages(searchQuery, currentPage);
});

async function searchImages(query, page) {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: apiKey,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: perPage,
        page: page,
      },
    });

    const { hits, totalHits } = response.data;
    if (hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    displayImages(hits);

    if (currentPage * perPage < totalHits) {
      loadMoreButton.style.display = 'block';
    } else {
      loadMoreButton.style.display = 'none';
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    Notiflix.Notify.failure('An error occurred while fetching images.');
  }
}

function displayImages(images) {
  images.forEach(image => {
    const photoCard = document.createElement('div');
    photoCard.classList.add('photo-card');

    const img = document.createElement('img');
    img.src = image.webformatURL;
    img.alt = image.tags;
    img.loading = 'lazy';

    const info = document.createElement('div');
    info.classList.add('info');

    const likes = document.createElement('p');
    likes.classList.add('info-item');
    likes.innerHTML = `<b>Likes:</b> ${image.likes}`;

    const views = document.createElement('p');
    views.classList.add('info-item');
    views.innerHTML = `<b>Views:</b> ${image.views}`;

    const comments = document.createElement('p');
    comments.classList.add('info-item');
    comments.innerHTML = `<b>Comments:</b> ${image.comments}`;

    const downloads = document.createElement('p');
    downloads.classList.add('info-item');
    downloads.innerHTML = `<b>Downloads:</b> ${image.downloads}`;

    info.appendChild(likes);
    info.appendChild(views);
    info.appendChild(comments);
    info.appendChild(downloads);

    photoCard.appendChild(img);
    photoCard.appendChild(info);

    gallery.appendChild(photoCard);
  });
}
