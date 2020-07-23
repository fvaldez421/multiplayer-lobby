import express from 'express';

import SocketHandler from '../util/SocketHandler';
import lobbyRoutes from './api/lobbies';
import userRoutes from './api/users';
import clientHandlers from './handlers/client';
import ticTacToeHandlers from './handlers/ticTacToe'


const apiRouter = express.Router();
const socketHandler = new SocketHandler();

// test route
apiRouter.get('', (req, res) => res.json({ message: 'Server is live!' }));

// client api routes
apiRouter.use('/api', [
  lobbyRoutes(apiRouter),
  userRoutes(apiRouter),
]);

// client socket handlers (no prefix used here)
socketHandler.use(clientHandlers(socketHandler))

// game session handlers (will have the `/tictactoe` prefix)
// ex: `<wss url>:port/tictactoe/<event type>`
socketHandler.use('/tictactoe', ticTacToeHandlers(socketHandler))


export {
  socketHandler,
  apiRouter as routes,
  apiRouter as default
};