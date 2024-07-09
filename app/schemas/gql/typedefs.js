import fs from 'node:fs/promises';

async function readGqlFiles() {

  try {

    //! Attention de bien avoir le version de node à 20+

    // Va lire le contenu total du dossier /schemas/gql
    const files = await fs.readdir(import.meta.dirname, 'utf8');

    // Va filtrer les fichiers terminant par .gql
    const gqlFiles = files.filter((file) => file.endsWith('.gql'));

    // Récupérer le contenu total de chaque fichier .gql pour ne faire qu'un
    const fileContents = await Promise.all(
      gqlFiles.map((file) => fs.readFile(`${import.meta.dirname}/${file}`, 'utf8')),
    );

    // Contenu total join pour ne faire qu'une chaîne de caractères
    return fileContents.join('\n');

  } catch (err) {
    console.error('Error reading .gql files:', err);
  }

}

export default await readGqlFiles();
