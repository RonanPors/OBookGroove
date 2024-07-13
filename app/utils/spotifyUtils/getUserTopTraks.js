// Fonction de récupération des Top Musiques de notre utilisateur.

import ErrorApi from "../../errors/api.error.js";

export async function getUserTopTracks(accessTokenSpotify) {

  let datasTable = [];
  const spotifyUserTrackUrl = process.env.SPOTIFY_USER_TRACKS;

  const response = await fetch(spotifyUserTrackUrl, {
    headers: {
      'Authorization': 'Bearer ' + accessTokenSpotify,
    },
  });

  const data = await response.json();

  if (!data || data.items.length === 0)
    throw new ErrorApi('FAILED_SPOTIFY_TRACKS', 'Échec de récupération des musiques Spotify.', { status: 500 });

  data.items.map((track) => {
    const obj = {
      artistName: track.artists.map(({ name }) => name).join(', '),
      trackName: track.name,
    };

    const stringTrack = `${obj.trackName} - ${obj.artistName}`;

    datasTable.push(stringTrack);
  });

  return datasTable;
}
