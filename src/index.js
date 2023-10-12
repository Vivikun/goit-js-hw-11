import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { searchImages } from './api';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');
const lightbox = new SimpleLightbox('.gallery a');

let currentPage = 1;
let currentQuery = '';

document.addEventListener('DOMContentLoaded', function () {
  searchForm.addEventListener('submit', async e => {
    e.preventDefault();
    const searchQuery = e.target.searchQuery.value.trim();

    if (searchQuery === '') {
      Notiflix.Notify.failure('Please enter a search query.');
      return;
    }

    if (searchQuery !== currentQuery) {
      currentPage = 1;
      gallery.innerHTML = '';
      currentQuery = searchQuery;
      searchAndDisplayImages(searchQuery, currentPage);
    }
  });

  loadMoreButton.addEventListener('click', () => {
    currentPage++;
    searchAndDisplayImages(currentQuery, currentPage, perPage);
  });
  async function searchAndDisplayImages(query, page, perPage) {
    try {
      const data = await searchImages(query, page);
      const { hits, totalHits } = data;

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

    lightbox.refresh();
  }
});
