import Notiflix from 'notiflix';
import SearchImg from './fetchSomething';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import createImgCard from './templates/img.hbs';

const searchImg = new SearchImg();
const refs = {
  form: document.querySelector('.search-form'),
  galleryDiv: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', onFormSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtn);

function onFormSearch(e) {
  e.preventDefault();
  searchImg.query = e.currentTarget.elements.searchQuery.value;
  refs.galleryDiv.innerHTML = '';

  searchImg
    .fetchImgByName()
    .then(data => {
      if (!data.hits.length) {
        Notiflix.Notify.info(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        createMarkUp(data.hits);
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
          </a>
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
              <b>Downloads ${downloads}</b>
            </p>
          </div>          
        </div>`;
      }
    )
    .join('');
  refs.galleryDiv.insertAdjacentHTML('beforeend', markUp);
  const lightbox = new SimpleLightbox('div.photo-card a', {
    captionDelay: 250,
  });
}

function onLoadMoreBtn() {
  searchImg.fetchImgByName();
}
