import { getUserTopTracks } from "./spotifyUtils/getUserTopTraks.js";
import { getMistralBooks } from "./mistralAIUtils/getMistralBooks.js";
import { updateActiveBooks } from "./updateActiveBook.js";
import { getGoogleBooks } from "../utils/googleBooksUtils/getGoogleBooks.js";
import { userHasBookDatamapper, bookDatamapper } from "../datamappers/index.datamapper.js";
import ErrorApi from "../errors/api.error.js";

//Services de suggestion de livres.

export default {

  async init(accessTokenSpotify, userId) {

    // Vérifier si il existe des livres actifs.
    const books = await userHasBookDatamapper.findAll({
      where: {
        userId,
        isActive: true,
      },
    });

    if (books.length <= 0)
      throw new ErrorApi('NO_ACTIVE_BOOKS_FOUND', 'Aucun livre actif trouvé pour l\'utilisateur.', { status: 404 });

    //On met à jour les livres actifs qui sont inférieurs ou égaux à la date actuelle -7 jours.
    const updateBooksConfirm = updateActiveBooks(books, userId);

    if (!updateBooksConfirm)
      throw new ErrorApi('FAILED_UPDATE_ACTIVE_BOOKS', 'Échec de mise à jour des livres actifs.', { status: 500 });

    // Supprimer toutes les associations de la BDD qui sont en is_active false ET is_favorite false
    await userHasBookDatamapper.delete({
      where: {
        isActive: false,
        isFavorite: false,
      },
    });

    //Récupération des livres actifs mis à jour en BDD.
    const newDataBooksUser = await userHasBookDatamapper.findAll({
      where: {
        userId,
        isActive: true,
      },
    });

    //Si il y a 10 livres actifs, on récupère les 10 dernier livres actifs et on les retourne au front avec un message pour informer l'utilisateur qu'il a atteind sa limite de requêtes autorisées.
    if (newDataBooksUser.length >= 10) {
      //!Attention on ne récupère que les id des livres de l'utilisateur dans currentIdBooksUser.
      const currentIdBooksUser = await userHasBookDatamapper.findAll({
        limit: 10,
        where: {
          userId,
          isActive: true,
        },
        order: {
          column: 'created_at',
          direction: 'desc',
        },
      });

      //On récupère les livres de la table book.
      const currentBooks = [];
      currentIdBooksUser.maps(async book => {
        currentBooks.push(await bookDatamapper.findByPk(book.bookId));
      });

      // Retourner les 10 livres de l'utilisateur.
      return currentBooks;
    };

    // Récupération des 10 dernières musiques de l'utilisateur à l'API Spotify.
    const tracks = await getUserTopTracks(accessTokenSpotify);


    if (!tracks)
      throw new ErrorApi('NO_TOP_TRACKS_FOUND', 'Aucune musique trouvée pour l\'utilisateur.', { status: 404 });

    // Utilisation de Mistral AI pour récupérer des titres et auteurs de livres sur la base des musiques:
    const mistralBooks = await getMistralBooks(tracks);

    // Récupérer 10 livres des titre retournées par Mistral depuis l'API Google Books
    //! Utiliser plutôt les titres et les auteurs fournis par Mistral AI
    const suggestBooks = await getGoogleBooks(mistralBooks);

    return suggestBooks;
    // Boucler sur les 40 livres et vérifier ceux qui ont déjà un isbn en BDD
    // Requête pour récupérer dans un tableau les ISBN avec l'id du book déjà présent dans la table book
    const booksAlreadyPresent = await Promise.all(
      suggestBooks.map(({ isbn }) => bookDatamapper.findByIsbn(isbn)),
    );

    // Vérifier l'id des livres trouvés dans la table d'association si ces livres sont lié à l'utilisateur actuellement ciblé
    // Vérifier seulement si le is_active ET/OU is_favorite true
    const userHasBookAlreadyPresentTrue = await Promise.all(
      booksAlreadyPresent.map(({ id: bookId }) => userHasBookDatamapper.findAll({
        where: {
          bookId,
          userId,
          isActive: true,
        },
        orWhere: {
          bookId,
          userId,
          isFavorite: true,
        },
      })),
    );

    // => S'il existe des associations entre les livres et l'utilisateur actuellement ciblé, supprimer ces livre des 40 livres
    const newSuggestBooks = userHasBookAlreadyPresentTrue.map((association) =>
      suggestBooks.filter((book) => book.isbn !== association.isbn),
    );

    // => Vérifier qu'il y ait au moins 10 livres
    if (newSuggestBooks.length < 10)
      throw new ErrorApi('NO_TOP_TRACKS_FOUND', 'Les suggestions sont inférieur à 10 livres.', { status: 404 });

    // On en choisi 10 Random.
    //! A refaire au propre plus tard avec une fonction utils
    const randomSuggestBooks = [];
    for (let i = 0; randomSuggestBooks.length !== 10; i++) {

      const randoms = [];

      // 0 à (length - 1)
      const random = Math.floor(Math.random() * newSuggestBooks.length);

      // Vérifier que le nombre aléatoire ne soit pas déjà pris grâce au tableau randoms[]
      if (!randoms.includes(random)) {

        // Si le nombre aléatoire est bien nouveau, le mettre dans le tableau randoms[]
        randoms.push(random);

        // Mettre le suggestBook dans le tableau final des suggestions
        randomSuggestBooks.push(newSuggestBooks[random]);

      }

    }

    // Pour chacun des 10 livres random :
    // On vérifie dans la table book si le livre existe via son ISBN.
    // Si le livre n'existe pas, on l'ajoute à la table book et on récupère son ID.
    // Si il existe on récupère l'id Book.
    // On cherche dans la table d'associtation user_has_book si le livre est associé à l'utilisateur.
    // Si le livre est associé, et que active, favorite sont à 0 on supprime la ligne.
    // On enregistre la nouvelle association.

    //! A optimiser plus tard avec un whereIn()
    const finalSuggestBooks = await Promise.all(

      randomSuggestBooks.map(async (suggest) => {

        let book = await bookDatamapper.findByIsbn(suggest.isbn);

        // SI le livre n'est pas trouvé en BDD
        // => Créer le livre en BDD
        if (!book) {

          book = await bookDatamapper.create({
            isbn: suggest.isbn,
            title: suggest.title,
            author: suggest.author,
            resume: suggest.resume,
            genre: suggest.genre, // tableau
            cover: suggest.cover,
            year: suggest.year,
            numberOfPages: suggest.numberOfPages,
          });

        }

        // Sinon, SI le livre a été trouvé en BDD
        // => Passer simplement à la création de l'association

        // Créer l'association entre le livre et l'utilisateur
        await userHasBookDatamapper.create({
          bookId: book.id,
          userId,
          isActive: true,
          isFavorite: false,
        });

        // Retourner le livre bien formaté
        return book;

      }),

    );

    // Retourner les 10 livres au front.
    return finalSuggestBooks;
  },
};
