import 'dotenv/config';
import { createServer } from 'node:http';
import app from './app/index.app.js';

const httpServer = createServer(app);

const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, () => {
  console.log(`Server launched at http://localhost:${PORT}`);
});
