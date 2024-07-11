// Algorythme de classification de genres des signatures musicales.

import ErrorApi from "../../errors/api.error.js";

export async function getBooksGenre(genres) {
  const key ='AIzaSyA0KVz_qj60aXxcU3syS1C-RWpL_2diVvc';
  `https://www.googleapis.com/books/v1/volumes?q=intitle:%22The%20Matrix%22%20OR%20intitle:%22Inception%22%20OR%20intitle:%22Interstellar%22&langRestrict=fr&orderBy=relevance&key=AIzaSyA0KVz_qj60aXxcU3syS1C-RWpL_2diVvc`;
  return true;
}
