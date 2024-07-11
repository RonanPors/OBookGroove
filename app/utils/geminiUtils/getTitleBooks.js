// Fonction de requête à Gemini pour la récupèration des titres de livres.
import axios from 'axios';
import crypto from 'crypto';

export async function getTitleBooks() {

  const API_KEY = process.env.GEMINI_API_KEY;
  const API_SECRET = process.env.GEMINI_API_SECRET;
  const API_URL = 'https://api.gemini.com/v1/ia';

  async function getBookSuggestionsBasedOnMusic(musicDetails) {
    const endpoint = '/suggest/books';
    const payload = {
      music: musicDetails,
    };

    const nonce = Date.now().toString();
    const requestPayload = {
      request: endpoint,
      nonce: nonce,
      ...payload,
    };

    const encodedPayload = Buffer.from(JSON.stringify(requestPayload)).toString('base64');
    const signature = crypto.createHmac('sha384', API_SECRET).update(encodedPayload).digest('hex');

    try {
      const response = await axios.post(`${API_URL}${endpoint}`, null, {
        headers: {
          'X-GEMINI-APIKEY': API_KEY,
          'X-GEMINI-PAYLOAD': encodedPayload,
          'X-GEMINI-SIGNATURE': signature,
          'Content-Type': 'text/plain',
        },
      });
      console.log('Suggestions de livres:', response.data);
    } catch (error) {
      console.error('Erreur lors de la requête pour des suggestions de livres:', error);
    }
  }

  // Exemple d'utilisation de la fonction
  const musicDetails = {
    genre: 'Jazz',
    artist: 'Miles Davis',
    album: 'Kind of Blue',
  };

  getBookSuggestionsBasedOnMusic(musicDetails);
}
