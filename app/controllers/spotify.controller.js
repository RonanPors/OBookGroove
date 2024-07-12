
import ErrorApi from '../errors/api.error.js';
import queryString from 'node:querystring';
import booksGenerator from '../utils/booksGenerator.js';
import { generateRandomString } from '../utils/generateRandomString.js';

// On génère une clés cryptée qui sera envoyée à l'API Spotify pour sécuriser les échanges entre notre serveur et l'API Tiers.
const stateKey = generateRandomString(64);
// On renseigne les informations fournies par spotify pour pouvoir s'identifier auprès de l'API Tiers.
const spotifyClientId = process.env.SPOTIFY_APP_CLIENT_ID;
const spotifyClientSecret = process.env.SPOTIFY_APP_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

export default {

  async connectToSpotify(req, res) {

    // On spécifie l'URL à l'API Tiers Spotify pour nos échange.
    const spotifyAuthUrl = process.env.SPOTIFY_AUTHORIZE;

    // On indique les paramètres de données de notre utilisateur que l'on souhaite exploiter de l'API Tiers.
    const scope = 'user-read-private user-read-email playlist-read-private user-top-read user-library-read';

    const params = {
      response_type: 'code',
      client_id: spotifyClientId,
      scope: scope,
      redirect_uri: redirect_uri,
      state: stateKey,
      show_dialog: true,
    };

    // On retourne l'URL contenant les proprietés attendues par l'API spotify en paramètres.
    return res.json({
      uri: spotifyAuthUrl + queryString.stringify(params),
    });

  },

  async callbackSpotify(req, res) {

    // Nous utilisons cette methode en réponse de l'API Spotify une fois que l'utilisateur à donné sont authorisation d'exploitation de ces données.

    // Gestion en cas de retour d'erreur de l'API Tiers Spotify.
    if (req.query.error)
      throw new ErrorApi('FAILED_SPOTIFY_AUTH', 'État de la requête invalide.', { status: 401 });

    // On récupère le code et le state que nous à retourner l'API Spotify.
    const { code, state } = req.query;
    const storedState = state;

    // On compare le state reçu de l'API Spotify à notre stateKey pour vérifier que la réponse arrive bien de l'API Tiers Spotify.
    if (stateKey !== storedState || !state ) {
      throw new ErrorApi('FAILED_SPOTIFY_AUTH', 'État de la requête invalide 1.', { status: 401 });
    }

    // On prépare la cors de la requête qui servira à récupérer les tokens Spotify de notre utilisateur.
    const authOptions = {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic '+ Buffer.from(spotifyClientId + ':' + spotifyClientSecret).toString('base64'),
      },
      body: new URLSearchParams({
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code',
      }),
    };

    const response = await fetch(process.env.SPOTIFY_TOKEN, authOptions);

    if (!response)
      throw new ErrorApi('FAILED_SPOTIFY_AUTH', 'Échec de l\'authentification avec Spotify.', { status: 500 });

    // Récupération des tokens Spotify de notre utilisateur.
    const data = await response.json();

    // Vérification de l'existante des tokens Spotify.
    if (!data.refresh_token || !data.access_token)
      throw new ErrorApi('FAILED_SPOTIFY_AUTH', 'Échec de l\'authentification avec Spotify.', { status: 500 });

    // On met en cookies les tokens Spotify de l'utilisateur.
    res.cookie('access_token_spotify', data.access_token, { httpOnly: true, secure: false }); //! A passer en secure true en production
    res.cookie('refresh_token_spotify', data.refresh_token, { httpOnly: true, secure: false }); //! A passer en secure true en production

    // Lancement du service qui retourne 20 livres de l'API GoogleBooks ou de notre BDD.
    const suggestBooks = await booksGenerator.init(req.cookies);

    if (!suggestBooks)
      throw new ErrorApi('FAILED_BOOKS_SUGGEST', 'Échec de récupération des livres de suggestion.', { status: 500 });

    // Envoi des livres.
    res.json(suggestBooks);
  },

  async verifySpotifyUserToken(req, res) {

    // Fonction qui vérifie la présence des tokens spotify.
    if (!req.cookies['refresh_token_spotify'] || !req.cookies['access_token_spotify'])
      throw new ErrorApi('FAILED_SPOTIFY_AUTH', 'Échec de l\'authentification avec Spotify.', { status: 500 });

    // Récupération du refresh token Spotify.
    const refreshToken = req.cookies.refresh_token;

    // Préparation de la requête de demande de réinitialisation des tokens Spotify pour notre utilisateur.
    const authOptions = {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(spotifyClientId + ':' + spotifyClientSecret).toString('base64'),
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    };

    const response = await fetch(process.env.SPOTIFY_TOKEN, authOptions);

    if (!response)
      throw new ErrorApi('FAILED_SPOTIFY_AUTH', 'Échec de l\'authentification avec Spotify.', { status: 500 });

    const data = await response.json();

    if (!data.refresh_token || !data.access_token)
      res.json({ ok: false});

    res.cookie('access_token_spotify', data.access_token, { httpOnly: true, secure: false }); //! A passer en secure true en production
    res.cookie('refresh_token_spotify', data.refresh_token, { httpOnly: true, secure: false }); //! A passer en secure true en production

    res.json({ ok: true});

  },
};
