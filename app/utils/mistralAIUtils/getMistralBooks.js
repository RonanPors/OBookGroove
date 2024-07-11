// Fonction de requête à Gemini pour la récupèration des titres de livres.
import MistralClient from '@mistralai/mistralai';


export async function getMistralBooks(tracks) {

  const client = new MistralClient(process.env.MISTRAL_API_KEY);

  const input = `1.Peux tu me suggerer un genre littéraire de livre pour chacune des musiques ci dessous dans un objet contenant une propriété "Associations":
  ${tracks}
  2. Propose moi ensuite 20 livres en édition francaise de ces genres en indiquant le titre du livre, l'auteur et le genre correspondant et ajoute les à l'objet dans une seconde propriété "livres".
  Si il y a des espaces dans les chaines de caractère remplace les par des "+".
  Retourne moi uniquement les JSON sans texte supplementaire.
  `;

  // chatResponse.choices[0].message.content
  const { choices: [ { message: { content } } ] } = await client.chat({
    model: 'mistral-large-latest',
    messages: [{role: 'user', content: input}],
  });

  const { Livres } = JSON.parse(content);

  return Livres;
}
