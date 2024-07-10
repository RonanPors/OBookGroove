// Fonction de récupération des features d'une musique de notre utilisateur.

import ErrorApi from "../../errors/api.error.js";

export async function getTrackFeatures(trackId, accessTokenSpotify) {

  const spotifyUserTrackUrl = process.env.SPOTIFY_FEATURES_TRACKS;

  const response = await fetch(`${spotifyUserTrackUrl}${trackId}`, {
    headers: {
      'Authorization': 'Bearer ' + accessTokenSpotify,
    },
  });

  const data = await response.json();

  if (!data || data.items.length === 0)
    throw new ErrorApi('FAILED_SPOTIFY_FEATURES', 'Échec de récupération des signatures de musique Spotify.', { status: 500 });

  return data;
}
