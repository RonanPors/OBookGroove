import { getUserTopTraks } from "./spotifyUtils/getUserTopTraks.js";
// import { getTrackFeatures } from "./spotifyUtils/getFeatureTraks.js";
// import { getGenreOfTrack } from "./getGenreOfTrack.js";
import { getTitleBooks } from "./geminiUtils/getTitleBooks.js";
import { updateActiveBooks } from "./updateActiveBook.js";
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

    //Récupération des livres actifs mis à jour en BDD.
    const newDataBooksUser = await userHasBookDatamapper.findAll({
      where: {
        userId,
        isActive: true,
      },
    });

    //Si il y a 200 livres actifs, on récupère les 20 dernier livres actifs et on les retourne au front avec un message pour informer l'utilisateur qu'il a atteind sa limite de requêtes autorisées.
    if (newDataBooksUser.length >= 200) {
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

      // Retourner les 20 livres de l'utilisateur.
      return currentBooks;
    };

    // Récupération des tops musique de l'utilisateur à l'API Spotify.
    const trackIds = await getUserTopTraks(accessTokenSpotify);

    if (!trackIds)
      throw new ErrorApi('NO_TOP_TRACKS_FOUND', 'Aucune musique trouvée pour l\'utilisateur.', { status: 404 });

    //!A remplacer par GEMINI à ce moment :
    // Maintenant que l'on possède l'id des musiques de l'utilisateur, on récupère leurs signatures musicales à l'API Spotify.
    /*     const globalSignTracks = await Promise.all(
      trackIds.map(async track =>
        await getTrackFeatures(track.id, accessTokenSpotify)),
    );
    //Récupération des genres des signatures musicales.
    const genresBooks = globalSignTracks.map( signTrack =>
      getGenreOfTrack(signTrack, genreTracks),
    ); */
    //!Fin de remplacement.

    // Récupérer 100 livres des titre retournées par gemini depuis l'API Google Books
    //! Utiliser plutôt les titres et les auteurs fournis par Gemini
    const suggestBooks = await getTitleBooks(geminiBooksSuggest);

    // Boucler sur les 100 livres et vérifier ceux qui ont déjà un isbn en BDD
    // Requête pour récupérer dans un tableau les ISBN avec l'id du book déjà présent dans la table book
    const booksAlreadyPresent = await Promise.all(
      suggestBooks.map(({ isbn }) => bookDatamapper.findByIsbn(isbn)),
    );

    // Vérifier l'id du book trouvé dans la table d'association si ce livre est lié à l'utilisateur actuellement ciblé
    const userHasBookAlreadyPresent = await Promise.all(
      booksAlreadyPresent.map(({ id: bookId }) => userHasBookDatamapper.findAll({
        where: {
          bookId,
          userId,
        },
      })),
    );

    // => Si il existe une association entre le livre et l'utilisateur actuellement ciblé, vérifier le is_active et le is_favorite, si un des deux est true, supprimer ce livre des 100 livres
    // => Sinon, garder le livres dans les 100 livres

    // On en choisi 20 Random.

    // Pour chacun des 20 livres random :
    // On vérifie dans la table book si le livre existe via son ISBN.
    // Si le livre n'existe pas, on l'ajoute à la table book et on récupère son ID.
    // Si il existe on récupère l'id Book.
    // On cherche dans la table d'associtation user_has_book si le livre est associé à l'utilisateur.
    // Si le livre est associé, et que active, favorite sont à 0 on supprime la ligne.
    // On enregistre la nouvelle association.

    // Retourner les 20 livres au front.
    return trackIds;
  },
};
