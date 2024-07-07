import crypto from 'crypto';
import ErrorApi from '../errors/api.error.js';

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
      client_Id: spotifyClientId,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state,
    };

    res.redirect(spotifyAuthUrl, params);

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
        'Authorization': 'Basic'+ Buffer.from(spotifyClientId + ':' + spotifyClientSecret).toString('base64'),
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

    if (data.refresh_token && data.access_token) {
      res.cookie('access_token_spotify', data.access_token, { httpOnly: true, secure: false }); //! A passer en secure true en production
      res.cookie('refresh_token_spotify', data.refresh_token, { httpOnly: true, secure: false }); //! A passer en secure true en production
      res.send('Tokens enregistrés dans les cookies');
    };
  },

  async refreshSpotifyUserToken(req, res) {
    const spotifyClientId = process.env.SPOTIFY_APP_CLIENT_ID;
    const spotifyClientSecret = process.env.SPOTIFY_APP_CLIENT_SECRET;

    const refreshToken = req.cookies.refresh_token;

    const authOptions = {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic'+ Buffer.from(spotifyClientId + ':' + spotifyClientSecret).toString('base64'),
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
      res.send('Nouveaux tokens enregistrés dans les cookies');
    };
  },
};
