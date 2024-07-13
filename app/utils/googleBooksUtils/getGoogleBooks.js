// Algorythme de classification de genres des signatures musicales.
import ErrorApi from "../../errors/api.error.js";

export async function getGoogleBooks(books) {

  const API_KEY = process.env.GOOGLEBOOK_API_KEY;

  const suggestBooks = await Promise.all(
    books.map(async ({titre, auteur}) => {

      const url = `https://www.googleapis.com/books/v1/volumes?q=intitle:"${titre}"+inauthor:"${auteur}"&printType=books&maxResults=1&projection=full&langRestrict=fr&key=${API_KEY}`;
      const response = await fetch(url);

      if (!response.ok)
        throw new ErrorApi('GOOGLE_BOOKS_API_ERROR', 'Erreur lors de la récupération des livres via Google Books API', { status: response.status });

      const data = await response.json();

      if (!data.items || data.totalItems === 0)
        return null;

      const { items: [ { id, volumeInfo } ] } = data;

      return {
        isbn: id,
        title: volumeInfo?.title,
        author: volumeInfo?.authors?.join(','),
        resume: volumeInfo?.description,
        genre: volumeInfo?.categories?.join(','),
        cover: volumeInfo?.imageLinks?.smallThumbnail,
        year: volumeInfo?.publishedDate ? new Date(volumeInfo?.publishedDate).getFullYear() : undefined,
        numberOfPages: volumeInfo?.pageCount,
      };

    }),
  );

  // Le filter enlève les valeurs null ou undefined du tableau
  return suggestBooks.filter(book => book !== null || undefined);

}
