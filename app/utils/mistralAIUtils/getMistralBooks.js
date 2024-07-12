// Fonction de requête à Gemini pour la récupèration des titres de livres.
import MistralClient from '@mistralai/mistralai';
import * as changeKeys from 'change-case/keys';
import ErrorApi from '../../errors/api.error.js';


export async function getMistralBooks(tracks) {

  const client = new MistralClient(process.env.MISTRAL_API_KEY);

  const input = `
    Propriété « associations »: suggère un genre littéraire pour chaque musiques:
    ${tracks}
    Propriété « livres »: propose moi 20 livres en rapport avec le style de genre des musiques.
    Ajoute un « + » à chaque espaces pour les strings.
    Retourne la totalité en un objet JSON sans texte supplémentaire.
    Voici un exemple de format JSON:
    {"association":[{"track": "musique","artist": "artiste","genre": "genre"}],"livres":[{"titre": "titre","auteur": "auteur","genre": "genre"}]}
  `;

  // chatResponse.choices[0].message.content
  const { choices: [ { message: { content } } ] } = await client.chat({
    model: 'mistral-large-latest',
    response_format: {'type': 'json_object'},
    messages: [{role: 'user', content: input}],
  });

  const contentParse = JSON.parse(content);

  const { livres } = changeKeys.camelCase(contentParse, 3);

  if(!livres)
    throw new ErrorApi('FAILED_GET_MISTAL_BOOKS', 'Échec de récupération des livres Gemini.', { status: 500 });

  console.log('livres:', livres);

  return livres;
}
