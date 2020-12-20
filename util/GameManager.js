import { GAME_TYPES } from "../config/constants";
import { TicTacToe } from "../games";


const {
  GAME_TIC_TAC_TOE
} = GAME_TYPES


const getGameClass = type => {
  switch (type) {
    case GAME_TIC_TAC_TOE:
      return TicTacToe
    default:
      console.error("Game not found: ", type)
      break;
  }
}

/**
 * Global Game Manager object: Used to manage multiple game sessions across
 * the entire server
 */
class GameManager {
  constructor() {
    this.games = {}
    this.hasSession = this.hasSession.bind(this)
    this.getSession = this.getSession.bind(this);
    this.addSession = this.addSession.bind(this);
    this.endSession = this.endSession.bind(this);
  }

  hasSession(lobbyHash = '') {
    const instance = this.games[lobbyHash]
    if (lobbyHash && instance) {
      return instance.isLive()
    }
    return false
  }

  getSession(lobbyHash = '') {
    const instance = this.games[lobbyHash]
    if (lobbyHash && instance) {
      return instance
    }
    return null
  }

  addSession(lobbyHash, gameInstance) {
    if (lobbyHash && lobbyHash) {
      try {
        this.games[lobbyHash] = gameInstance
        console.log(`Successfully added game session: ${gameInstance.gameType} at ${lobbyHash}`)
      } catch (err) {
        console.error(`Error adding session: ${gameInstance.gameType} at ${lobbyHash}: ${JSON.stringify(err)}`)
      }
    } else {
      console.error(`No lobbyHash: ${lobbyHash} or instance: ${gameInstance.gameType} provided`)
    }
  }

  endSession(lobbyHash) {
    if (lobbyHash) {
      try {
        this.games[lobbyHash].endSession()
      } catch (err) {
        console.error(`Error ending game at ${lobbyHash}: ${JSON.stringify(err)}`)
      }
    }
  }

}


export default new GameManager()