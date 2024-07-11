// Fonction de requête à Gemini pour la récupèration des titres de livres.
import MistralClient from '@mistralai/mistralai';
import * as changeKeys from 'change-case/keys';


export async function getMistralBooks(tracks) {

  const client = new MistralClient(process.env.MISTRAL_API_KEY);

  const input = `
    Peux tu me suggerer un genre littéraire de livre pour chacune des musiques ci dessous dans un objet contenant une propriété "associations":
    ${tracks}
    Propose moi ensuite 20 livres en édition francaise de ces genres en indiquant le titre du livre, l'auteur et le genre correspondant et ajoute les à l'objet dans une seconde propriété "livres".
    Si il y a des espaces dans les chaines de caractère remplace les par des "+".
    Je veux que ta réponse soit SEULEMENT le résultat des livres que tu me proposes sans texte supplémentaire dans un format JSON et dans un objet nommé livres.
  `;

  // chatResponse.choices[0].message.content
  const { choices: [ { message: { content } } ] } = await client.chat({
    model: 'mistral-large-latest',
    response_format: {'type': 'json_object'},
    messages: [{role: 'user', content: input}],
  });

  const contentParse = JSON.parse(content);

  const { livres } = changeKeys.camelCase(contentParse, 3);

  return livres;
}
