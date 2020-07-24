// import and use handler helpers here
import { COMMON_GAME_EVENTS } from "../../config/constants"
import { TicTacToe } from "../../games"
// global game manager instance
import GameManager from "../../util/GameManager"


const {
  INITIALIZE,
  START_GAME,
  EDIT_GAME,
  JOIN_GAME,
  LEAVE_GAME,
  GAME_EVENT,
  END_GAME
} = COMMON_GAME_EVENTS


const handlers = socketHandler => {
  const gameHandlers = [
    socketHandler.makeHandler(INITIALIZE, (data, io, socket) => {
      console.log('initializing game:', data)

    }),
    socketHandler.makeHandler(START_GAME, (data, io, socket) => {
      console.log('user started game:', data)

    }),
    socketHandler.makeHandler(EDIT_GAME, (data, io, socket) => {
      console.log('user edited game:', data)

    }),
    socketHandler.makeHandler(JOIN_GAME, (data, io, socket) => {
      console.log('user joined game:', data)
      socket.emit('users-update', '🎶 Hello from the seeerrrvvverrr siiiddee!! 🎶')
    }),
    socketHandler.makeHandler(GAME_EVENT, (data, io, socket) => {
      console.log('tic tac toe game event:', data)
      socket.emit('move-update', { position: { ...data } })
    }),
    socketHandler.makeHandler(LEAVE_GAME, data => {
      console.log('user left game:', data)
    }),
    socketHandler.makeHandler(END_GAME, data => {

      console.log('host ended game:', data)
    })
  ]

  return gameHandlers
}

export default handlers