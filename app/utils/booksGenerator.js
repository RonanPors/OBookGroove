import { getUserTopTraks } from "./spotifyUtils/getUserTopTraks.js";
import { getTrackFeatures } from "./spotifyUtils/getFeatureTraks.js";
import { getGenreOfTrack } from "./getGenreOfTrack.js";
import { userHasBookDatamapper } from "../datamappers/index.datamapper.js";
//Services de suggestion de livres

export default {

  // {
  //   access_token_spotify: accessTokenSpotify,
  //   claims: { sub: userId },
  // }

  async init(objet) {

    // Vérifier si il existe des livres actifs.
    // const books = await userHasBookDatamapper.findAll({
    //   where: {
    //     userId,
    //     isActive: true,
    //   },
    // });
    return true;
    //Si il y a des livres actifs, on met à jour les livres actifs par rapport au date de création.
    //Utils: on recupère les livres actifs
    //Pour chaque livres, on compare la date de création à la date actuelle.
    //Si la date est antérieur à 7 jours par rapport à now(), on passe le livres en actif: false.


    //Vérifier si il y à 200 livres actifs.

    //Si il y a 200 livres actifs, on récupère les 20 dernier livres actifs et on les retourne au front avec un message pour informer l'utilisateur qu'il a atteind sa limite de requêtes autorisées.

    // Tableau contenant les 10 Tops musiques de l'utilisateur.
    const trackIds = await getUserTopTraks(accessTokenSpotify);

    if (!trackIds)
      throw new ErrorApi('NO_TOP_TRACKS_FOUND', 'Aucun Top Track trouvé pour l\'utilisateur.', { status: 404 });

    // Tableau contenant les features des musiques de l'utilisateur.
    const resultGlobalFeatures = await Promise.all(
      trackIds.map(async track =>
        await getTrackFeatures(track.id, accessTokenSpotify)),
    );
    //Boucler sur le résultat des features pour assigner un genre de livre.
    const genresBooks = resultGlobalFeatures.map( features =>
      getGenreOfTrack(features, genreTracks),
    );

    // Récupérer 100 livres des genres retournées depuis l'API Google Books

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
