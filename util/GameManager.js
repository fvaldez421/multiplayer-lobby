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


class GameManager {
  constructor() {
    this.games = {}
    this.makeGame = this.makeGame.bind(this);
    this.endGame = this.endGame.bind(this);
  }

  hasGame(hash = '') {
    const instance = this.games[hash]
    if (hash && instance) {
      return instance.isLive()
    }
  }

  makeGame(type = '', options = {}) {
    const { hash } = options
    if (type && hash) {
      try {
        const GameTypeClass = getGameClass(type)
        const gameInstance = new GameTypeClass(hash)
        this.games[hash] = gameInstance
        console.log(`Successfully created game: ${type} at ${hash}`)
      } catch (err) {
        console.error(`Error creating game ${type} at ${hash}: ${JSON.stringify(err)}`)
      }
    } else {
      console.error(`No type: ${type} or hash: ${hash} provided`)
    }
  }

  endGame(hash) {
    if (hash) {
      try {
        this.games[hash].endGame()
      } catch (err) {
        console.error(`Error ending game at ${hash}: ${JSON.stringify(err)}`)
      }
    }
  }

}


export default new GameManager()