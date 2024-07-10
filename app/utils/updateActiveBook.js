// Fonction de mise à jour des livres actifs.
import { userHasBookDatamapper } from '../datamappers/index.datamapper.js';

import ErrorApi from "../errors/api.error.js";

export async function updateActiveBooks(books) {
  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);

  books.map(async book => {
    if (new Date(book.created_at) <= sevenDaysAgo) {
      await userHasBookDatamapper.update({
        id: book.id,
        isActive: false,
      });
    }
  });
  return true;
}
