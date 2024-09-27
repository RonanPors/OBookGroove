// Fonction de requête à Gemini pour la récupèration des titres de livres.
import MistralClient from '@mistralai/mistralai';
import * as changeKeys from 'change-case/keys';
import ErrorApi from '../../errors/api.error.js';


export async function getMistralBooks(tracks) {

  const client = new MistralClient(process.env.MISTRAL_API_KEY);

  const input = `
    Propriété « associations »: suggère un genre littéraire pour chaque musiques:
    ${tracks}
    Propriété « books »: propose moi 20 livres en rapport avec le style de genre des musiques.
    Ajoute un « + » à chaque espaces pour les strings.
    Retourne la totalité en générant uniquement une sortie JSON sous ce format :
    {"association":[{"track": "musique","artist": "artiste","genre": "genre"}],"books":[{"titre": "titre","auteur": "auteur","genre": "genre"}]}
  `;

  // chatResponse.choices[0].message.content
  const { choices: [ { message: { content } } ] } = await client.chat({
    model: 'mistral-large-latest',
    response_format: {'type': 'json_object'},
    messages: [{role: 'user', content: input}],
  });

  const contentParse = JSON.parse(cleanJSONResponse(content));

  const { books } = changeKeys.camelCase(contentParse, 3);

  if (!books)
    throw new ErrorApi('FAILED_GET_MISTAL_BOOKS', 'Échec dans la récupération des livres depuis l\'IA.', { status: 500 });

  return books;
}

function cleanJSONResponse(content) {
  // Supprime les ```json au début et ``` en fin
  if (content.startsWith("```json")) {
    content = content.slice(7); // Supprime les premiers 7 caractères (```json)
  }
  if (content.endsWith("```")) {
    content = content.slice(0, -3); // Supprime les 3 derniers caractères (```)
  }
  return content;
}
