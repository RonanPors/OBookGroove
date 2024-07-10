// Algorythme de classification de genres des signatures musicales.

export async function getGenreOfTrack(features, genreTracks) {
  let bestMatch = null;
  let bestScore = Infinity;

  // Pour chaque propriété dans genreTracks (Roman, Aventure, etc...)
  for (const genre in genreTracks) {
    let genreScore = 0;
    let trackCount = 0;

    // Parcourt chaque morceau du genre actuel
    for (const track of genreTracks[genre]) {
      if (track.features) {
        // Calcule la différence entre les caractéristiques du morceau et celles du morceau actuel du genre
        const featureDiff = Math.abs(features.tempo - track.features.tempo)
          + Math.abs(features.energy - track.features.energy)
          + Math.abs(features.danceability - track.features.danceability);

        genreScore += featureDiff; // Ajoute la différence totale au score du genre
        trackCount++; // Incrémente le nombre de morceaux dans le genre
      }
    }

    // Calcule le score moyen pour le genre actuel
    const averageScore = genreScore / trackCount;

    // Si le score moyen du genre actuel est le meilleur jusqu'à présent, met à jour bestScore et bestMatch
    if (averageScore < bestScore) {
      bestScore = averageScore;
      bestMatch = genre;
    }
  }

  // Retourne le meilleur genre trouvé ou 'Unknown Genre' si aucun genre n'a été trouvé
  return bestMatch || 'Unknown Genre';
}
