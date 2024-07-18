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

    if (books.length > 0) {
      //On met à jour les livres actifs qui sont inférieurs ou égaux à la date actuelle -7 jours.
      const updateBooksConfirm = updateActiveBooks(books, userId);

      if (!updateBooksConfirm)
        throw new ErrorApi('FAILED_UPDATE_ACTIVE_BOOKS', 'Échec de mise à jour des livres actifs.', { status: 500 });
    }


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

    //Si il y a 10 livres actifs, on récupère les 10 derniers livres actifs et on les retourne au front avec un message pour informer l'utilisateur qu'il a atteint sa limite de requêtes autorisées.
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
      const currentBooks = await Promise.all(
        currentIdBooksUser.map(async book => {

          const newBook = await bookDatamapper.findByKey('id', book.bookId);

          return {
            ...newBook,
            isFavorite: book.isFavorite,
          };

        }),
      );

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

    // => Vérifier qu'il y ait au moins 10 livres
    //! Si Google Books renvoi moins de 10 livres, ça ne sert à rien d'aller plus loin car ça ne fonctionnera pas
    //! Donc autant rapeller le service à partir d'ici et ne pas faire des requêtes à la BDD pour rien
    if (suggestBooks?.length < 10)
      throw new ErrorApi('NO_TOP_TRACKS_FOUND', 'Le retour de Google Books est inférieur à 10 livres.', { status: 404 });

    // Boucler sur les 20 livres et vérifier ceux qui ont déjà un isbn en BDD
    // Requête pour récupérer dans un tableau les ISBN avec l'id du book déjà présent dans la table book
    const booksAlreadyPresent = await Promise.all(
      suggestBooks.map(({ isbn }) => bookDatamapper.findByKey('isbn', isbn)),
    );

    // Filtrer les résultats pour éliminer les valeurs undefined ou null
    const filteredBooksAlreadyPresent = booksAlreadyPresent.filter((book) => book !== undefined || null);

    // Vérifier l'id des livres trouvés dans la table d'association si ces livres sont lié à l'utilisateur actuellement ciblé
    // Vérifier seulement si le is_active ET/OU is_favorite true
    const userHasBookAlreadyPresentTrue = [];
    for (let i = 0; i < filteredBooksAlreadyPresent.length; i++) {

      const [ book ] = await userHasBookDatamapper.findAll({
        where: {
          bookId: filteredBooksAlreadyPresent[i].id,
          userId,
          isActive: true,
        },
        orWhere: {
          bookId: filteredBooksAlreadyPresent[i].id,
          userId,
          isFavorite: true,
        },
      });

      if (book)
        userHasBookAlreadyPresentTrue.push(book);

    }

    // Filtrer les résultats pour éliminer les valeurs undefined ou null
    const filteredUserHasBookAlreadyPresentTrue = userHasBookAlreadyPresentTrue.filter((association) => association !== undefined || null);

    // S'il existe des associations entre les livres et l'utilisateur actuellement ciblé, supprimer ces livre des 20 livres
    // => Commencer par créer un tableau des livres qui sont en association TRUE avec l'utilisateur
    const booksAlreadyPresentTrue = await Promise.all(
      filteredUserHasBookAlreadyPresentTrue.map((association) => bookDatamapper.findByKey('id', association.bookId)),
    );

    // Filtrer les résultats pour éliminer les valeurs undefined ou null
    const filteredBooksAlreadyPresentTrue = booksAlreadyPresentTrue.filter((book) => book !== undefined || null);

    // => Ensuite, créer un tableau de suggestions qui n'ont pas le même isbn que les livres du tableau ci-dessus
    const existingIsbns = filteredBooksAlreadyPresentTrue.map(book => book.isbn);
    const newSuggestBooks = suggestBooks.filter((book) => !existingIsbns.includes(book.isbn));

    // Filtrer les résultats pour éliminer les valeurs undefined ou null
    const filteredSuggestBooks = newSuggestBooks.filter((book) => book !== undefined || null);

    // => Vérifier qu'il y ait au moins 10 livres
    if (filteredSuggestBooks?.length < 10)
      throw new ErrorApi('NO_TOP_TRACKS_FOUND', 'Les suggestions sont inférieur à 10 livres.', { status: 404 });

    // On en choisi 10 Random.
    //! A refaire au propre plus tard avec une fonction utils
    const randomSuggestBooks = [];
    const randoms = new Set();
    for (let i = 0; randomSuggestBooks.length < 10; i++) {

      // 0 à (length - 1)
      const random = Math.floor(Math.random() * filteredSuggestBooks.length);

      // Vérifier que le nombre aléatoire ne soit pas déjà pris grâce au tableau randoms[]
      if (!randoms.has(random)) {

        // Si le nombre aléatoire est bien nouveau, le mettre dans le tableau randoms[]
        randoms.add(random);

        // Mettre le suggestBook dans le tableau final des suggestions
        randomSuggestBooks.push(filteredSuggestBooks[random]);

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

        // Vérifier si le livre existe déjà en bdd
        //! Normalement cette recherche ne sert à rien à ce niveau là
        let book = await bookDatamapper.findByKey('isbn', suggest.isbn);

        // SI le livre n'est pas trouvé en BDD
        // => Créer le livre en BDD
        if (!book) {

          book = await bookDatamapper.create({
            isbn: suggest.isbn,
            title: suggest.title,
            author: suggest.author,
            resume: suggest.resume,
            genre: suggest.genre, // tableau //! problème ici, à mettre et JSON (stringify)
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

        const newBook = await bookDatamapper.findByKey('isbn', suggest.isbn);

        // Retourner le livre déjà existant ou nouvellement créé en BDD
        return {
          ...newBook,
          isFavorite: false,
        };

      }),

    );

    // Retourner les 10 livres au front.
    return finalSuggestBooks;
  },
};
