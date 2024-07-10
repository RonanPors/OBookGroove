const fetch = require('node-fetch');

const accessToken = 'YOUR_SPOTIFY_ACCESS_TOKEN';

const genreTracks = {
  "Roman": [
    { id: "3TYK1pzH0WpAXkDx1ZtIEb", features: null },  // "I Dreamed a Dream"
    { id: "3u9O6unD76ZcWpp8NVoM11", features: null }, // "On My Own"
    { id: "1w5XA2KZArQLzzOJNtwvUh", features: null }, // "Do You Hear the People Sing?"
    // Ajouter d'autres morceaux...
  ],
  "Aventure": [
    { id: "0gXzA68jB9JxA3HMXEtFWR", features: null },  // "Raiders March"
    { id: "1gIuZrrO2T9K9NTp1S8ht6", features: null },  // "The Map Room: Dawn"
    { id: "4nNHjkJDmydSflpLZsttDN", features: null },  // "The Basket Game"
    // Ajouter d'autres morceaux...
  ],
  // Ajouter d'autres genres et morceaux...
};

async function getTrackFeatures(trackId) {
  const response = await fetch(`https://api.spotify.com/v1/audio-features/${trackId}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  if (response.ok) {
    return response.json();
  } else {
    throw new Error('Failed to fetch track features');
  }
}

async function fetchAndStoreTrackFeatures(genreTracks) {
  for (const genre in genreTracks) {
    for (const track of genreTracks[genre]) {
      track.features = await getTrackFeatures(track.id);
    }
  }
}

async function classifyMusicSignature(features, genreTracks) {
  let bestMatch = null;
  let bestScore = Infinity;

  for (const genre in genreTracks) {
    let genreScore = 0;
    let trackCount = 0;

    for (const track of genreTracks[genre]) {
      if (track.features) {
        const featureDiff = Math.abs(features.tempo - track.features.tempo)
          + Math.abs(features.energy - track.features.energy)
          + Math.abs(features.danceability - track.features.danceability);
        genreScore += featureDiff;
        trackCount++;
      }
    }

    const averageScore = genreScore / trackCount;
    if (averageScore < bestScore) {
      bestScore = averageScore;
      bestMatch = genre;
    }
  }

  return bestMatch || 'Unknown Genre';
}

async function main(trackId) {
  try {
    // await fetchAndStoreTrackFeatures(genreTracks);
    const features = await getTrackFeatures(trackId);
    const genre = classifyMusicSignature(features, genreTracks);
    console.log(`Le genre du film est: ${genre}`);
  } catch (error) {
    console.error('Error fetching track features:', error);
  }
}

// Exemple d'utilisation
const trackId = 'YOUR_SPOTIFY_TRACK_ID'; // Remplacez par un ID de morceau Spotify pour tester
main(trackId);
