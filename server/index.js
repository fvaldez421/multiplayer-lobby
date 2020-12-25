import chalk from 'chalk'
import server from './server';
import { SOCKET_PATH } from '../config/constants';


// Log any server errors
server.on('error', err => {
  console.error('Server error:', err);
});

console.log(process.env.PORT)
// open port
server.listen(process.env.PORT, () => {
  console.log(chalk.magenta(`🌎 ===> Server listening to http on port ${process.env.PORT}`));
  console.log(chalk.magenta(`🌎 ===> Server listening to sockets on port ${SOCKET_PATH}`));
});

export { server, socketHandler } from './server';