import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const apiKey = '37042837-efaf1ad73896b324f11be5dd6';
const search = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-btn');
axios.defaults.baseURL = 'https://pixabay.com/api/';
let lightbox;
let page = 1;
let q = '';

async function getUl(userRequest, page) {
  const imagesArray = await axios.get(
    `?key=${apiKey}&q=${userRequest}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
  );
  return imagesArray.data;
}

function galleryConstructor(e) {
  e.preventDefault();
  gallery.innerHTML = '';
  loadBtn.classList.add('is-hidden');
  let page = 1;
  q = search.searchQuery.value;
  getUl(q, page).then(imagesArray => {
    if (imagesArray.totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again'
      );
    } else {
      const pictures = imagesArray.hits
        .map(
          galleryItem => `<a class= "gallery-link" href="${galleryItem.largeImageURL}"><div class="photo-card">
        <img src="${galleryItem.webformatURL}" alt="${galleryItem.tags}" loading="lazy" />
        <div class="info">
        <p class="info-item">
    <b>Likes</b> ${galleryItem.likes}
  </p>
  <p class="info-item">
    <b>Views</b> ${galleryItem.views}
  </p>
  <p class="info-item">
    <b>Comments</b> ${galleryItem.comments}
  </p>
  <p class="info-item">
    <b>Downloads</b> ${galleryItem.downloads}
  </p>
        </div>
        </div></a>`
        )
        .join('');
      gallery.insertAdjacentHTML('beforeend', pictures);
      Notiflix.Notify.info(`Hooray! We found ${imagesArray.totalHits} images.`);
      lightbox = new SimpleLightbox('a', {
        captionsData: 'alt',
        captionDelay: 250,
      }).refresh();
      if (imagesArray.totalHits > 40) {
        loadBtn.classList.remove('is-hidden');
      }
    }
  });
}

function galleryExpand() {
  page += 1;
  lightbox.destroy();
  q = search.searchQuery.value;
  getUl(q, page).then(imagesArray => {
    const pictures = imagesArray.hits
      .map(
        gallery => `<a class= "gallery-link" href="${gallery.largeImageURL}"><div class="photo-card">
        <img src="${gallery.webformatURL}" alt="${gallery.tags}" loading="lazy" />
        <div class="info">
        <p class="info-item">
    <b>Likes</b> ${gallery.likes}
  </p>
  <p class="info-item">
    <b>Views</b> ${gallery.views}
  </p>
  <p class="info-item">
    <b>Comments</b> ${gallery.comments}
  </p>
  <p class="info-item">
    <b>Downloads</b> ${gallery.downloads}
  </p>
        </div>
        </div></a>`
      )
      .join('');
    gallery.insertAdjacentHTML('beforeend', pictures);
    lightbox = new SimpleLightbox('a', {
      captionsData: 'alt',
      captionDelay: 250,
    }).refresh();
    const pages = Math.ceil(imagesArray.totalHits / 40);
    if (page >= pages) {
      loadBtn.classList.add('is-hidden');
      return Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
  });
}

search.addEventListener('submit', galleryConstructor);
loadBtn.addEventListener('click', galleryExpand);
