// import and use handler helpers here


const handlers = socketHandler => ([
  socketHandler.makeHandler('join', (data, io, socket) => {
    console.log('user joined game:', data)
    socket.emit('lobbies-update', '🎶 Hello from the seeerrrvvverrr siiiddee!! 🎶')
  }),
  socketHandler.makeHandler('game-event', data => {
    console.log('game event:', data)
  }),
  socketHandler.makeHandler('exit-game', data => {
    console.log('user left game:', data)
  })
]);

export default handlers;