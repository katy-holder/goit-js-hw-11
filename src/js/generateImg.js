import imgTpl from '../templates/card';
import refs from "./refs";

export default function generateImagesMarkup(images){
    refs.gallery.insertAdjacentHTML('beforeend', imgTpl(images));    
  };