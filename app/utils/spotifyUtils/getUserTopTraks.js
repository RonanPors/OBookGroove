// Fonction de récupération des Top Musiques de notre utilisateur.

import ErrorApi from "../../errors/api.error.js";

export async function getUserTopTraks(accessTokenSpotify) {

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
}
