import expressJSDocSwagger from "express-jsdoc-swagger";

const optionsSwagger = {
  info: {
    version: '1.0.0',
    title: 'O\'BookGroove',
    description: 'Documentation de l\'API d\'authentification et de l\'API GraphQL.',
  },
  security: {
    BasicAuth: {
      type: 'http',
      scheme: 'basic',
    },
  },
  // le répertoire de base ou le module ira analyser la JSdoc
  baseDir: import.meta.dirname,
  // Le motif des fichiers qu'il devra analyser dans ce repertoire global
  filesPattern: '../../**/*.js',
  // la route sur laquelle sera accessible la documentation HTML
  swaggerUIPath: '/documentation',
  // Est-ce que cette documentation HTML est accessible
  exposeSwaggerUI: true,
  // Est-ce que la documentation en JSON est accessible
  exposeApiDocs: false,
  // La route sur laquelle est disponible la document JSON
  apiDocsPath: '/v3/api-docs',
  // Si la valeur est true scela remplira les propriété non fourni par une valeur null
  notRequiredAsNullable: false,
  // Si on le souhaite on peut modifier l'apparence de l'interface HTML de la doc (cf. documentation du module)
  swaggerUiOptions: {},
};

// Currying
export default (app) => expressJSDocSwagger(app)(optionsSwagger);
