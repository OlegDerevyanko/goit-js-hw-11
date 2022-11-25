import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { requestHTTP } from './fetchPicture'

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
let lightbox = new SimpleLightbox('.gallery a');

//========================================================
const form = document.querySelector('#search-form');
const formInput = document.querySelector('#search-form input');
const formBtn = document.querySelector('#search-form button');
//Стиль кнопки для поиска   //Default style for search button 
formBtn.setAttribute('disabled', true);
formBtn.style.backgroundColor = "#c9c9c9";

const loadMoreBtn = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');
//================================================================

form.addEventListener('input', showSearchBtn);//Показываем кнопку поиска  //Showing search button
form.addEventListener('submit', getImages);//Получаем запрос // Receiving a request 

//loadMoreBtn.addEventListener('click', loadMoreData); <--//Загружаем больше данных  // Loading more data 
//Кнопка LOAD MORE нужно расскоментировать

window.addEventListener('scroll', infinityScroll); // Загружаем больше данных  // Loading more data

let PAGE_COUNTER = 1;

//Первый запрос с input  //First request with input
function getImages(evt) {
  evt.preventDefault();
  updateHTML(); //Обновляем документHTML //Update the documentHTML

  const inputText = formInput.value.trim(); //значение input
  requestHTTP(inputText, PAGE_COUNTER).then(({ data }) => {  
    if (data.total === 0) {
      Notify.failure("Sorry, there are no images matching your search query. Please try again.")
      return;
    } else {
      Notify.success(`Hooray! We found ${data.totalHits} images`);
      markupCards(data); //Добавляем разметку  //Add mark-up

      // loadMoreBtn.style.display = "block"; //<-- Кнопка LOAD MORE

      lightbox.refresh();
    }
  }).catch(error => console.log(error)); 
}

// Загрузка следующих запросов  // Loading the following queriesA
function loadMoreData() {
   const inputText = formInput.value;
  PAGE_COUNTER ++;
  requestHTTP(inputText, PAGE_COUNTER).then(({ data }) => {
    if (data.hits.length < 40) {
      loadMoreBtn.style.display = "none"; //Удаление кнопки load-more // Removing the load-more button
    } else {
       markupCards(data);//Добавляем разметку  //Add mark-up
    lightbox.refresh();
    } 
  }).catch(error => console.log(error));
}

//Бесконечный скрол //Infinity scroll
function infinityScroll() {
    const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
  // const scrl = scrollHeight - clientHeight;           
  // console.log("🚀 ~ scrl", scrl);
  if (scrollHeight - clientHeight === scrollTop) {
    loadMoreData();
  }
  // console.log("🚀 ~ scrollHeigth", scrollHeight);
  // console.log("🚀 ~ scrollTop", scrollTop);
  // console.log("🚀 ~ clientHeight", clientHeight);
}

//Макет разметки //Example of markup 
function markupCards(data) {
  const dataArray = data.hits;  //Даные обьектов //Objects data

  const markup = dataArray.map(object => {
        const { webformatURL, largeImageURL, tags, likes, views, comments, downloads } = object;
       return `<div class="photo-card">
    <a href="${largeImageURL}">
    <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
    </a>
  <div class="info" >
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>
</div> `}).join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}

//Показываем кнопку поиска  //Showing search button
function showSearchBtn() {
     const inputValue = formInput.value.trim();
    if (inputValue.length === 0 ) {
        blockSearchBtn();
    } else {
        formBtn.removeAttribute('disabled');
        formBtn.style.backgroundColor = "white"; 
    }
}
//Прячем кнопку поиска  //Hiding the search button
function blockSearchBtn() {
    formBtn.setAttribute('disabled', true);
    formBtn.style.backgroundColor = "#c9c9c9";
}
//Обновляем документHTML //Update the documentHTML
function updateHTML() {
  gallery.innerHTML = "";
  PAGE_COUNTER = 1
  blockSearchBtn()
  loadMoreBtn.style.display = "none";
}