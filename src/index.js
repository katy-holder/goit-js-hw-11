import './css/styles.css';
import API from "./js/getImages";
import Notiflix from 'notiflix';
import refs from "./js/refs";
import "simplelightbox/dist/simple-lightbox.min.css";
import SimpleLightbox from "simplelightbox";
import generateImg from "./js/generateImg";


let lightbox = new SimpleLightbox('.gallery a');

refs.searchForm.addEventListener("submit", onFormSubmit);

async function generateMarkup() {
    const result = await API.getImages();
    const images = result?.data?.hits;
    generateImg(images);
    lightbox.refresh();
}

function totalHits(total){
  if (total) {
    Notiflix.Notify.success(`Hooray! We found ${total} images.`);
  }
}

function onFormSubmit(event) {
  API.params.page = 1;
  API.params.q = event.currentTarget.elements.searchQuery.value;
  refs.gallery.innerHTML = "";
  event.preventDefault();
  generateMarkup();
  API.getImages().then(({data} = {}) => {
    if (data?.total === 0) {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      return;
    }
    totalHits(data?.total)});
}

function onObserver(entries) {
  entries.forEach(entry => {
    if (entry.intersectionRatio && API.params.q !== "") {
      loadMore();
    }
  })
}

async function loadMore(){
    API.params.page += 1;
}

const options = {
  rootMargin: "400px",
};

const observer = new IntersectionObserver(onObserver, options);
observer.observe(refs.sentinel);
