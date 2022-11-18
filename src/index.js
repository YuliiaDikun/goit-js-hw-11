import Notiflix from 'notiflix';
import SearchImg from './fetchSomething';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchImg = new SearchImg();

const refs = {
  form: document.querySelector('.search-form'),
  galleryDiv: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  resetBtn: document.querySelector('.reset'),
  buttonsDiv: document.querySelector('.buttons-container'),
};

refs.form.addEventListener('submit', onFormSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtn);
refs.resetBtn.addEventListener('click', onResetBtn);

function onFormSearch(e) {
  e.preventDefault();
  if (!e.currentTarget.elements.searchQuery.value) {
    Notiflix.Notify.failure('Please, type below your search query!');
    return;
  }
  searchImg.query = e.currentTarget.elements.searchQuery.value
    .toLowerCase()
    .trim();
  refs.galleryDiv.innerHTML = '';
  searchImg.page = 1;
  searchImg
    .fetchImgByName()
    .then(data => {
      if (!data.total) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      if (data.total === 1) {
        createMarkUp(data.hits);
        return;
      } else {
        refs.buttonsDiv.classList.remove('is-hidden');
        createMarkUp(data.hits);
      }
    })
    .catch(error => console.log(error));
  e.target.reset();
}

function createMarkUp(arrayOfPhotos) {
  const allImg = arrayOfPhotos.map(
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
          <a class="photo-card__link" href="${largeImageURL}">          
          <img src="${webformatURL}" alt="${tags}" loading="lazy" />
           
          </a>  
          <div class="info">
            <p class="info-item">
              <b> ${likes}</b>
            </p>
            <p class="info-item"> 
              <b> ${views}</b>
            </p>
            <p class="info-item">
              <b> ${comments}</b>
            </p>
            <p class="info-item">
              <b> ${downloads}</b>
            </p>
          </div>                  
        </div>`;
    }
  );
  const firstImg = allImg.slice(0, 4).join('');
  const secondImg = allImg.slice(4, 8).join('');
  const thirdImg = allImg.slice(8).join('');
  const markUp = `<div class="column">${firstImg}</div><div class="column">${secondImg}</div><div class="column">${thirdImg}</div>`;
  refs.galleryDiv.insertAdjacentHTML('beforeend', markUp);
  const lightbox = new SimpleLightbox('div.photo-card a', {
    captionDelay: 250,
  });
  lightbox.refresh();
}

function onLoadMoreBtn() {
  searchImg
    .fetchImgByName()
    .then(data => {
      if (data.totalHits === data.page) {
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
        return;
      } else {
        Notiflix.Notify.success(
          `Hooray! We found ${data.totalHits - searchImg.page * 12} images.`
        );
        createMarkUp(data.hits);
      }
    })
    .catch(error => console.log(error));
}

function onResetBtn() {
  location.reload();
}
