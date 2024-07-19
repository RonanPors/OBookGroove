import 'dotenv/config';
import { createServer } from 'node:http';
import app from './app/index.app.js';

const httpServer = createServer(app);

const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`🚀HTTP Server launched at http://localhost:${PORT} 🚀`);
    console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
  }
});
