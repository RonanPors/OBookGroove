import express from 'express';
import pinoHttp from 'pino-http';
import cookieParser from 'cookie-parser';
import router from './routers/index.router.js';
import docMiddleware from './middlewares/doc.mw.js';
const app = express();

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(pinoHttp());

// Utilisation de swagger
docMiddleware(app);

app.use(router);

export default app;
