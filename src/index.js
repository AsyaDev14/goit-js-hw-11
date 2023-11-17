import { fetchGallery } from "./fetch-gallary";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';

const form = document.querySelector(".search-form");
const buttonLoad = document.querySelector(".load-more");
const gallery = document.querySelector(".gallery");

form.addEventListener('submit', handleSubmit);
buttonLoad.addEventListener('click', loadMore);

let page = 1;
let totalHits = 0;

async function handleSubmit(event) {
  event.preventDefault();
  try {
    gallery.innerHTML = '';
    // Reset page to 1 for a new search
    page = 1;
    const value = event.currentTarget.elements.searchQuery.value;
    if (!value) {
      buttonLoad.classList.add('is-hidden');
      return;
    }

    

    const res = await fetchGallery(value, page);
    totalHits = res.totalHits;
    renderImage(res);
    // buttonLoad.classList.remove('is-hidden');

  } catch (error) {
    console.log("this is error", error);
  }
};

function renderImage(data) {
  console.log("data", data);
  if (data.totalHits === 0) {
    buttonLoad.classList.add('is-hidden');
    gallery.innerHTML = '';
    // alert('error')
    Notiflix.Notify.info('Sorry, there are no images matching your search query. Please try again.');
    return;
  }
  buttonLoad.classList.remove('is-hidden');

  const cardSet = data.hits.map(card => (
    `
  <div class="photo-card">
    <a class="photo__link" href="${card.largeImageURL}" data-lightbox="gallery">
      <img src=${card.largeImageURL} alt="" loading="lazy" width="300px" height='280px'/>
    </a>
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
           ${card.likes}
        </p>
        <p class="info-item">
          <b>Views</b>
          ${card.views}
        </p>
        <p class="info-item">
          <b>Comments</b>
          ${card.comments}
        </p>
        <p class="info-item">
          <b>Downloads</b>
          ${card.downloads}
        </p>
      </div>
  </div>
    `
  )).join('');

  // gallery.innerHTML = cardSet;
  gallery.insertAdjacentHTML('beforeend', cardSet)
  // 
  const lightbox = new SimpleLightbox('.gallery a', {});
  // lightbox.refresh()
};


async function loadMore() {
  page += 1
  const value = form.elements.searchQuery.value;
  const res = await fetchGallery(value, page);
  renderImage(res);
  // Check if the total hits have been reached
  if (page * 40 >= totalHits) {
    buttonLoad.classList.add('is-hidden');
    Notiflix.Notify.info('We are sorry, but you`ve reached the end of search results.');
  }
};