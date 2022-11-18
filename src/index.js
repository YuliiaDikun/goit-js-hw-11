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
  searchImg.page = 1;
  searchImg
    .fetchImgByName()
    .then(data => {
      if (!data.total) {
        Notiflix.Notify.info(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      if (data.total === 1) {
        createMarkUp(data.hits);
        return;
      } else {
        refs.loadMoreBtn.classList.remove('is-hidden');
        createMarkUp(data.hits);
      }
    })
    .catch(error => console.log(error));
}

function createMarkUp(arrayOfPhotos) {
  const allImg = arrayOfPhotos.map(
    (
      { webformatURL, largeImageURL, tags, likes, views, comments, downloads },
      inx
    ) => {
      return `
        <div class="photo-card">
          <a class="photo-card__link" href="${largeImageURL}">          
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
  );
  const firstSevenItems = allImg.slice(0, 3).join('');
  const secondImg = allImg.slice(3, 6).join('');
  const thirdImg = allImg.slice(6, 9).join('');
  const fourthImg = allImg.slice(9).join('');
  const markUp = `<div class="column">${firstSevenItems}</div><div class="column">${secondImg}</div><div class="column">${thirdImg}</div><div class="column">${fourthImg}</div>`;
  refs.galleryDiv.insertAdjacentHTML('beforeend', markUp);
  const lightbox = new SimpleLightbox('div.photo-card a', {
    captionDelay: 250,
  });
}

function onLoadMoreBtn() {
  searchImg
    .fetchImgByName()
    .then(data => {
      console.log(data);
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
