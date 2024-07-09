import crypto from 'crypto';
import ErrorApi from '../errors/api.error.js';
import queryString from 'node:querystring';
import bookGenerator from '../utils/booksGenerator.js';

export default {

  async connectToSpotify(req, res) {

    const spotifyClientId = process.env.SPOTIFY_APP_CLIENT_ID;
    const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;
    const spotifyAuthUrl = process.env.SPOTIFY_AUTHORIZE;

    const generateRandomString = (length) => {
      return crypto
        .randomBytes(60)
        .toString('hex')
        .slice(0, length);
    };

    const state = generateRandomString(64);
    const stateKey = 'spotify_auth_state';
    const scope = 'user-read-private user-read-email playlist-read-private user-top-read user-library-read';

    res.cookie(stateKey, state);

    const params = {
      response_type: 'code',
      client_id: spotifyClientId,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state,
    };

    return res.redirect(spotifyAuthUrl + queryString.stringify(params));

  },

  async callbackSpotify(req, res) {

    if (req.query.error)
      throw new ErrorApi('FAILED_SPOTIFY_AUTH', 'État de la requête invalide.', { status: 401 });

    const { code, state } = req.query;
    const stateKey = 'spotify_auth_state';
    const storedState = req.cookie ? req.cookies[stateKey] : null;
    const spotifyClientId = process.env.SPOTIFY_APP_CLIENT_ID;
    const spotifyClientSecret = process.env.SPOTIFY_APP_CLIENT_SECRET;
    const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

    if (state !== storedState || !state ) {
      throw new ErrorApi('FAILED_SPOTIFY_AUTH', 'État de la requête invalide.', { status: 401 });
    }

    res.clearCookie(stateKey);

    const authOptions = {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'authorization': 'Basic'+ Buffer.from(spotifyClientId + ':' + spotifyClientSecret).toString('base64'),
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

    const data = await response.json();

    if (!data.refresh_token || !data.access_token)
      throw new ErrorApi('FAILED_SPOTIFY_AUTH', 'Échec de l\'authentification avec Spotify.', { status: 500 });

    res.cookie('access_token_spotify', data.access_token, { httpOnly: true, secure: false }); //! A passer en secure true en production
    res.cookie('refresh_token_spotify', data.refresh_token, { httpOnly: true, secure: false }); //! A passer en secure true en production

    // Utilisation d'un service qui retourne des livres refresh ou en BDD
    const suggestBooks = await Promise.all(bookGenerator.init(req));

    if (!suggestBooks)
      throw new ErrorApi('FAILED_BOOKS_SUGGEST', 'Échec de récupération des livres de suggestion.', { status: 500 });

    // Retourner les livres au front
    res.json(suggestBooks);
  },

  async verifySpotifyUserToken(req, res) {

    // Fonction qui vérifie la présence des tokens spotify
    if (!req.cookie('refresh_token_spotify') || !req.cookie('access_token_spotify'))
      throw new ErrorApi('FAILED_SPOTIFY_AUTH', 'Échec de l\'authentification avec Spotify.', { status: 500 });

    const spotifyClientId = process.env.SPOTIFY_APP_CLIENT_ID;
    const spotifyClientSecret = process.env.SPOTIFY_APP_CLIENT_SECRET;
    const refreshToken = req.cookies.refresh_token;

    const authOptions = {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic'+ Buffer.from(spotifyClientId + ':' + spotifyClientSecret).toString('base64'),
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

    if (data.refresh_token && data.access_token) {
      res.cookie('access_token_spotify', data.access_token, { httpOnly: true, secure: false }); //! A passer en secure true en production
      res.cookie('refresh_token_spotify', data.refresh_token, { httpOnly: true, secure: false }); //! A passer en secure true en production

      res.json({ ok: true});
    };
  },

  async getUserTopTraks(req, res) {

    let datasTable = [];
    const accessToken = req.cookie['access_token_spotify'];
    const spotifyUserTrackUrl = process.env.SPOTIFY_USER_TRACKS;

    const response = await fetch(spotifyUserTrackUrl, {
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
    });

    const data = await response.json();

    if (!data || data.items.length === 0)
      throw new ErrorApi('FAILED_SPOTIFY_TRACKS', 'Échec de récupération des musiques Spotify.', { status: 500 });

    data.items.map(async (track) => {

      const obj = {
        artistName: track.artists.map((artist) => artist.name),
        artistId: track.artists.map((artist) => artist.id),
        trackIsrc: track.external_ids.isrc,
        trackId: track.id,
        trackName: track.name,
        durationSeconds: Math.floor(track.duration_ms / 1000),
      };
      datasTable.push(obj);
    });

    return datasTable;
  },
};
