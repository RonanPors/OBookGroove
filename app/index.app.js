import express from 'express';
// import pinoHttp from 'pino-http';
import cookieParser from 'cookie-parser';
import cors from 'cors';

//! ======= IMPORT FOR APOLLO =======

import { ApolloServer } from '@apollo/server';
import { expressMiddleware as apolloMiddleware } from '@apollo/server/express4';
import typeDefs from './schemas/gql/typedefs.js';
import resolvers from './resolvers/index.resolvers.js';

//* DataLoaders
import { createUserLoader, createBookLoader } from './utils/dataloaders.js';

//! ======= IMPORT FOR APOLLO =======

import router from './routers/index.router.js';
import docMiddleware from './middlewares/doc.mw.js';
import authMiddleware from './middlewares/auth.mw.js';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(cookieParser());

// Middleware qui sert à authentifier un utilisateur côté server
app.use(authMiddleware);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(pinoHttp());

// Utilisation de swagger
docMiddleware(app);

//! ====== APOLLO SERVER MIDDLEWARE =======

// Fonction qui sert à définir le context utilisable dans le MW Apollo Server
async function getContext({ req }) {

  // userLoader va contenir l'instance du DataLoader pour la table 'user'
  const userLoader = createUserLoader();
  // bookLoader va contenir l'instance du DataLoader pour la table 'book'
  const bookLoader = createBookLoader();

  const context = { userLoader, bookLoader };

  // Si l'utilisateur a été authentifié par le auth MW, le context sera mis au courant
  if (req.auth) context.user = req.auth.sub;

  if (req.cookies) context.cookies = req.cookies;

  return context;

}

// Utilisation d'Apollo Server en tant que Middleware
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

// Démarrage du serveur apollo
await apolloServer.start();

// Utilisation du serveur apollo comme middleware sur la route /graphql
app.use('/graphql', apolloMiddleware(apolloServer, {

  // Définir le context avec le référence de la fonction getContext
  // getContext sera appelé à chaque requête GQL
  context: getContext,

}));

//! ====== APOLLO SERVER MIDDLEWARE =======

app.use(router);

export default app;
