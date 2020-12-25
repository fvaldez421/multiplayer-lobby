import dotenv from 'dotenv'
import http from 'http';
import express from 'express';
import socketIo from 'socket.io';
import bodyParser from 'body-parser';
import morgan from 'morgan';
// import path from 'path';
import { socketHandler, routes } from '../routes';
import cors from 'cors';
import { SOCKET_PATH } from '../config/constants';


dotenv.config()
console.log(process.env)
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  path: SOCKET_PATH,
  cors: {
    origin: '*'
  }
});
socketHandler.setIo(io);

// encode and parse our request data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// handle logging
app.use(morgan('combined'));

/**
 * The lines below are soley used for testing socket.io while serving 
 * static files from `views`. They will likely be removed after v1 of the 
 * client side React app is up and has support for websockets
 */
// app.use(express.static(__dirname + '/../node_modules'));
// app.use(express.static(path.join(__dirname, 'views')));
// app.get('/index.html', (req, res) => {
//   res.sendFile(path.join(__dirname + '/../views/index.html'))
// })

// handle cors
app.use(cors())
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", '*')
  next();
})

// implement our routes
app.use('/', routes);

export {
  socketHandler,
  server,
  server as default
};