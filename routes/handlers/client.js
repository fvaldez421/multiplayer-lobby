// import and use handler helpers here


const handlers = socketHandler => ([
  socketHandler.makeHandler('join', (data, io, socket) => {
    console.log('user joined game:', data)
  }),
  socketHandler.makeHandler('game-update', data => {
    console.log('game update:', data)
  }),
  socketHandler.makeHandler('exit-game', data => {
    console.log('user left game:', data)
  })
]);

export default handlers;