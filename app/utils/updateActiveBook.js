// Fonction de mise à jour des livres actifs.

import ErrorApi from "../errors/api.error.js";

export async function updateActiveBooks(books) {
  const now = new Date();

  books.map(async book => {
    if (new Date(book.created_at) >= new Date(now.setDate(now.getDate() - 7))) {
      await userHasBookDatamapper.update({
        id: book.id,
        is_active: false
      });
    }
  });
}
  await userHasBookDatamapper.update(input));
