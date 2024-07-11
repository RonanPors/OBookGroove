// Algorythme de classification de genres des signatures musicales.

import ErrorApi from "../../errors/api.error.js";

export async function getGoogleBooks(books) {

  const API_KEY = process.env.GOOGLEBOOK_API_KEY;

  const suggestBooks = await Promise.all(
    books.map(async ({Titre, Auteur}, i) => {

      const url = `https://www.googleapis.com/books/v1/volumes?q=intitle:"${Titre}"+inauthor:"${Auteur}"&printType=books&maxResults=1&projection=full&langRestrict=fr&key=${API_KEY}`;
      const response = await fetch(url);

      if (!response.ok)
        throw new ErrorApi('GOOGLE_BOOKS_API_ERROR', 'Erreur lors de la récupération des livres via Google Books API', { status: response.status });

      const { items: [ item ] } = await response.json();

      console.log('data fetch:', JSON.stringify(item));

      return item;

      // const { items: [ item ] } = await response.json();

      // console.log(item);

      // return {
      //   isbn: item?.id,
      //   title: item?.volumeInfo?.title,
      //   author: item?.volumeInfo?.authors[0],
      //   resume: item?.volumeInfo?.description,
      //   genre: item?.volumeInfo?.categories[0],
      //   cover: item?.volumeInfo?.imageLinks?.smallThumbnail,
      //   year: new Date(item?.volumeInfo?.publishedDate)?.getFullYear(),
      //   numberOfPages: item?.volumeInfo?.pageCount,
      // };

    }),
  );

  // console.log('suggestBooks', suggestBooks);

  return suggestBooks;

}
