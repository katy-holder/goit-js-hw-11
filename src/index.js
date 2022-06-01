import './css/styles.css';
import API from "./js/getImages";
import Notiflix from 'notiflix';
import refs from "./js/refs";
import "simplelightbox/dist/simple-lightbox.min.css";
import SimpleLightbox from "simplelightbox";
import generateImg from "./js/generateImg";


let lightbox = new SimpleLightbox('.gallery a');

refs.searchForm.addEventListener("submit", onFormSubmit);

function generateMarkup(images) {
    generateImg(images);
    lightbox.refresh();
}

function totalHits(total){
  if (total) {
    Notiflix.Notify.success(`Hooray! We found ${total} images.`);
  }
}

async function onFormSubmit(event) {
  API.params.page = 1;
  API.params.q = event.currentTarget.elements.searchQuery.value;
  refs.gallery.innerHTML = "";
  event.preventDefault();
  const result = await API.getImages();
    if (result?.data?.total === 0) {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      return;
    }
    totalHits(result?.data?.total);
    generateMarkup(result?.data?.hits)
}

function onObserver(entries) {
  entries.forEach(entry => {
    if (entry.intersectionRatio && API.params.q !== "") {
      loadMore();
    }
  })
}

async function loadMore(){
  lightbox.refresh();
  const result = await API.getImages();
    API.params.page += 1;
    generateMarkup(result?.data?.hits);
}

const options = {
  rootMargin: "400px",
};

const observer = new IntersectionObserver(onObserver, options);
observer.observe(refs.sentinel);
