import { getUserTopTraks } from "./spotifyUtils/getUserTopTraks.js";
import { getTrackFeatures } from "./spotifyUtils/getFeatureTraks.js";
import { getGenreOfTrack } from "./getGenreOfTrack.js";
import { getBooksGenre } from "./googleBooksUtils/getBooksGenre.js";
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
    const updateBooksConfirm = updateActiveBooks(books);

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
        limit: 20,
        where: {
          userId: id,
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
        currentBooks.push(await bookDatamapper.findByPk(book.bookId) );
      });

      // Retourner les 20 livres de l'utilisateur.
      return currentBooks;
    };

    // Récupération des tops musique de l'utilisateur à l'API Spotify.
    const trackIds = await getUserTopTraks(accessTokenSpotify);

    if (!trackIds)
      throw new ErrorApi('NO_TOP_TRACKS_FOUND', 'Aucun Top Track trouvé pour l\'utilisateur.', { status: 404 });

    // Maintenant que l'on possède l'id des musiques de l'utilisateur, on récupère leurs signatures musicales à l'API Spotify.
    const globalSignTracks = await Promise.all(
      trackIds.map(async track =>
        await getTrackFeatures(track.id, accessTokenSpotify)),
    );
    //Récupération des genres des signatures musicales.
    const genresBooks = globalSignTracks.map( signTrack =>
      getGenreOfTrack(signTrack, genreTracks),
    );

    // Récupérer 100 livres des genres retournées depuis l'API Google Books
    const suggestBooks = await getBooksGenre(genresBooks);

    // Boucler sur les 100 livres et vérifier ceux qui ont déjà un isbn en BDD

    //! Une requête pour récupérer dans une tableau les ISBN avec l'id du book déjà présent dans la table book
    // => A chaque fois que nous trouvons un ISBN déjà en BDD dans la table book (créer un index SQL pour optimiser la rechercher)
    //! Une requête pour la vérification
    // => vérifier l'id du book trouvé dans la table d'association si ce livre est lié à l'utilisateur actuellement ciblé

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
