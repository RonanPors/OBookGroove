// Fonction de mise à jour des livres actifs.
import { userHasBookDatamapper } from '../datamappers/index.datamapper.js';

export async function updateActiveBooks(books, userId) {
  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);

  books.map(async book => {
    if (new Date(book.createdAt) <= sevenDaysAgo) {
      await userHasBookDatamapper.update({
        bookId: book.id,
        userId,
        isActive: false,
      });
    }
  });
  return true;
}
