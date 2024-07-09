import ErrorApi from "../../errors/api.error.js";

export async function getUserTopTraks(cookies) {
  console.log(cookies);
  let datasTable = [];
  const accessToken = cookies['access_token_spotify'];
  const spotifyUserTrackUrl = process.env.SPOTIFY_USER_TRACKS;
  console.log('1.5');
  const response = await fetch(spotifyUserTrackUrl, {
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  });
  console.log('2');
  const data = await response.json();
  console.log('3');
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
  console.log('4');
  return datasTable;
}
