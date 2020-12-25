// import and use handler helpers here
import { COMMON_GAME_EVENTS } from "../../config/constants"
import { TicTacToe } from "../../games"
// global game manager instance
import GameManager from "../../util/GameManager"
import { GAME_EVENTS as GAME_EVENTS_3T } from "../../games/TicTacToe"


const {
  INITIALIZE,
  START_GAME,
  EDIT_GAME,
  JOIN_GAME,
  LEAVE_GAME,
  RESET_GAME,
  END_GAME
} = COMMON_GAME_EVENTS

const {
  PLAYER_MOVE
} = GAME_EVENTS_3T

// add session verification before prod
const initGameSession = (data, io, socket) => {
  try {
    let session = GameManager.getSession(data.lobbyHash)
    if (!session) {
      console.log('making a new session:', { lobbyHash: data.lobbyHash })
      session = new TicTacToe(io, { lobbyHash: data.lobbyHash })
      if (session) {
        session.initialize()
        GameManager.addSession(data.lobbyHash, session)
      } else {
        console.log('Error making game session')
      }
    } else {
      console.log(`Tic Tac Toe Lobby: ${data.lobbyHash} exists`)
    }
  } catch (err) {
    console.log(`ERROR: ${err}`)
  }
}

const makeSessionHandler = handler => (data, io, socket) => {
  try {
    if (data.lobbyHash) {
      const session = GameManager.getSession(data.lobbyHash)
      if (session) {
        handler(session, socket, data)
      } else {
        console.log(`Tic Tac Toe lobby: ${data.lobbyHash} not found`)
        initGameSession(data, io, socket)
      }
    } else {
      console.log(`invalid lobby hash: ${data.lobbyHash}`)
    }
  } catch (err) {
    console.log(`ERROR: ${err}`)
  }
}
const handlers = socketHandler => {
  const gameHandlers = [
    socketHandler.makeHandler(INITIALIZE, (data, io, socket) => {
      try {
        initGameSession(data, io, socket)
      } catch (err) {
        console.log(`ERROR: ${err}`)
      }
    }),
    socketHandler.makeHandler(START_GAME, (data, io, socket) => {
      console.log('user started game:', data)
    }),
    socketHandler.makeHandler(EDIT_GAME, (data, io, socket) => {
      console.log('user edited game:', data)
    }),
    socketHandler.makeHandler(JOIN_GAME, makeSessionHandler((session, socket, data) => {
      try {
        session.handlePlayerAdded(socket, data.player)
      } catch (err) {
        console.log(`ERROR: ${err}`)
      }
    })),
    socketHandler.makeHandler(PLAYER_MOVE, makeSessionHandler((session, socket, data) => {
      try {
        session.handleTileSelected(data)
      } catch (err) {
        console.log(`ERROR: ${err}`)
      }
    })),
    socketHandler.makeHandler(RESET_GAME, makeSessionHandler((session, socket, data) => {
      try {
        session.handleInitializeGame(data)
      } catch (err) {
        console.log(`ERROR: ${err}`)
      }
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