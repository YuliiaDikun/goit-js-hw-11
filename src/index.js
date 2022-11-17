import Notiflix from 'notiflix';
import API from './fetchSomething';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import createImgCard from './templates/img.hbs';

const refs = {
  form: document.querySelector('.search-form'),
  galleryDiv: document.querySelector('.gallery'),
};

refs.form.addEventListener('submit', onFormSearch);

function onFormSearch(e) {
  e.preventDefault();
  const query = e.currentTarget.elements.searchQuery.value;
  console.log(query);
  API.fetchImgByName(query)
    .then(data => {
      if (!data.length) {
        Notiflix;
      }
    })
    .catch(error => console.log(error));
}

function createMarkUp(arrayOfPhotos) {
  const markUp = arrayOfPhotos
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
        <div class="photo-card">
        <a href="${largeImageURL}">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info">
            <p class="info-item">
                <b>Likes ${likes}</b>
            </p>
            <p class="info-item">
                <b>Views ${views}</b>
            </p>
            <p class="info-item">
                <b>Comments ${comments}</b>
            </p>
            <p class="info-item">
                <b>Downloads${downloads}</b>
            </p>
        </div>
        </a>
        </div>`;
      }
    )
    .join('');
  refs.galleryDiv.insertAdjacentHTML('afterend', markUp);
}
