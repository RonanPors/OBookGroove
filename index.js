import { createServer} from 'node:http';
import 'dotenv/config';
import app from './app/index.app.js';

const PORT = process.env.PORT || 3000;

const httpServer = createServer(app);

httpServer.listen(PORT, () => {

  //If the server is running on a production instance, it is a good practice not to display logs in the terminal.
  if (process.env.NODE_ENV !== 'production') {
    console.log(`🚀HTTP Server launched at http://localhost:${PORT} 🚀`);
  }

});
