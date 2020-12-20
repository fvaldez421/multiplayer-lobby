// import and use handler helpers here
import { COMMON_GAME_EVENTS } from "../../config/constants"
import { TicTacToe } from "../../games"
// global game manager instance
import GameManager from "../../util/GameManager"
import { GAME_EVENTS } from "../../games/TicTacToe"


const {
  INITIALIZE,
  START_GAME,
  EDIT_GAME,
  JOIN_GAME,
  LEAVE_GAME,
  GAME_EVENT,
  END_GAME
} = COMMON_GAME_EVENTS

const {
  PLAYER_MOVE
} = GAME_EVENTS

const makeSessionHandler = handler => (data, io, socket) => {
  if (data.lobbyHash) {
    const session = GameManager.getSession(data.lobbyHash)
    if (session) {
      handler(session, socket, data)
    } else {
      console.log(`Tic Tac Toe lobby: ${data.lobbyHash} not found`)
    }
  } else {
    console.log(`invalid lobby hash: ${data.lobbyHash}`)
  }
}

const handlers = socketHandler => {
  const gameHandlers = [
    socketHandler.makeHandler(INITIALIZE, (data, io, socket) => {
      let session = GameManager.getSession(data.lobbyHash)
      if (!session) {
        console.log('making a new session:', { lobbyHash: data.lobbyHash })
        session = new TicTacToe(io, { lobbyHash: data.lobbyHash })
        if (session) {
          session.initialize({ updater: (...args) => console.log('this is a timer update', new Date().getTime(), ...args) })
          GameManager.addSession(data.lobbyHash, session)
        } else {
          console.log('Error making game session')
        }
      } else {
        console.log(`Tic Tac Toe Lobby: ${data.lobbyHash} exists`)
      }
    }),
    socketHandler.makeHandler(START_GAME, (data, io, socket) => {
      console.log('user started game:', data)
    }),
    socketHandler.makeHandler(EDIT_GAME, (data, io, socket) => {
      console.log('user edited game:', data)
    }),
    socketHandler.makeHandler(JOIN_GAME, makeSessionHandler((session, socket, data) => {
      session.handlePlayerAdded(socket, data.player)
    })),
    socketHandler.makeHandler(PLAYER_MOVE, makeSessionHandler((session, socket, data) => {
      session.handleTileSelected(data)
    })),
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