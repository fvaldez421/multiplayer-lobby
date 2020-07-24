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
    this.makeGame = this.makeGame.bind(this);
    this.endGame = this.endGame.bind(this);
  }

  hasGame(lobbyHash = '') {
    const instance = this.games[lobbyHash]
    if (lobbyHash && instance) {
      return instance.isLive()
    }
    return false
  }

  getGame(lobbyHash = '') {
    const instance = this.games[lobbyHash]
    if (lobbyHash && instance) {
      return instance
    }
    return null
  }

  makeGame(type = '', options = {}) {
    const { lobbyHash } = options
    if (type && lobbyHash) {
      try {
        const GameTypeClass = getGameClass(type)
        const gameInstance = new GameTypeClass({ lobbyHash })
        this.games[lobbyHash] = gameInstance
        console.log(`Successfully created game: ${type} at ${lobbyHash}`)
      } catch (err) {
        console.error(`Error creating game ${type} at ${lobbyHash}: ${JSON.stringify(err)}`)
      }
    } else {
      console.error(`No type: ${type} or lobbyHash: ${lobbyHash} provided`)
    }
  }

  endGame(lobbyHash) {
    if (lobbyHash) {
      try {
        this.games[lobbyHash].endGame()
      } catch (err) {
        console.error(`Error ending game at ${lobbyHash}: ${JSON.stringify(err)}`)
      }
    }
  }

}


export default new GameManager()