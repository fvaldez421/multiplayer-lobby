import chalk from 'chalk'
import server from './server';
import { PORT, SOCKET_PATH } from '../config/constants';


// Log any server errors
server.on('error', err => {
  console.error('Server error:', err);
});


// open port
server.listen(PORT, () => {
  console.log(chalk.magenta(`🌎 ===> Server listening to http on port ${PORT}`));
  console.log(chalk.magenta(`🌎 ===> Server listening to sockets on port ${SOCKET_PATH}`));
});

export { server, socketHandler } from './server';