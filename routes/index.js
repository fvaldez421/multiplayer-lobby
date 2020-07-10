import express from 'express';

import sockets from '../util/websocket';
import lobbyRoutes from './api/lobbies';
import userRoutes from './api/users';
import clientHandlers from './handlers/client';


const apiRouter = express.Router();
const socketHandler = sockets.Handler();

// test route
apiRouter.get('', (req, res) => res.json({ message: 'Server is live!' }));

// client api routes
apiRouter.use('/api', [
  lobbyRoutes(apiRouter),
  userRoutes(apiRouter),
]);

// client socket handlers
socketHandler.use([
  clientHandlers(socketHandler)
])

export {
  socketHandler,
  apiRouter as routes,
  apiRouter as default
};