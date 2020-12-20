import BaseGame from './BaseGame'
import { GAME_TYPES, COMMON_GAME_EVENTS } from '../config/constants'


export const GAME_EVENTS = {
  PLAYER_MOVE: 'player-move'
}


class TicTacToe extends BaseGame {
  constructor(io, options = {}) {
    super(io, options)
    this.blocks = new Array(9).fill(undefined)
    this.socketStatus = 'default'
    this.gameStatus = 'default'
    this.gameType = GAME_TYPES.GAME_TIC_TAC_TOE
    this.firstPlayer = null
    this.winnerPlayer = null
    this.resetPlayer = null
    this.players = {}
    this.playerTokens = {}
    this.playerLimit = 2
    this.player1 = null
    this.player2 = null
    this.handlePlayerAdded = this.handlePlayerAdded.bind(this)
    this.handleTileSelected = this.handleTileSelected.bind(this)
  }

  emitInitializeGame() {
    console.log('emit initialize game')
    this.getIo().to(this.lobbyId).emit(
      COMMON_GAME_EVENTS.GAME_STATUS_UPDATE,
      {
        updateType: 'game-init',
        players: this.players,
        playerTokens: {
          [this.player1]: this.player1.token,
          [this.player2]: this.player2.token
        }
      }
    )
  }

  handlePlayerAdded(socket, player) {
    const hadPlayer = this.hasPlayer(player.userId)
    const res = this.addPlayer(socket, player)
    if (!hadPlayer && res && (!this.player1 || !this.player2)) {
      // attempt adding player
      if (!this.player1) {
        this.player1 = { ...player, token: 'x' }
        this.playerTokens[player.userId] = 'x'
      } else if (this.player1 && !this.player2) {
        this.player2 = { ...player, token: 'o' }
        this.playerTokens[player.userId] = 'o'
      }
      // if last player added
      if (this.player1 && this.player2) {
        this.emitInitializeGame()
      }
    }
  }

  handleTileSelected(params) {
    if (params.userId && params.hasOwnProperty('index')) {
      console.log(`Tile ${params.index} selected by ${params.userId}`)
      this.blocks[params.index] = this.playerTokens[params.userId]
      this.emitGameUpdate(GAME_EVENTS.PLAYER_MOVE, {
        turnPlayer: params.userId == this.player1 ? this.player2 : this.player1,
        player: params.userId,
        index: params.index,
        value: this.playerTokens[params.userId],
        mapUpdate: this.blocks
      })
    } else {
      console.log(`Invalid userId: ${params.userId} or index: ${params.index}`)
    }
  }


}

export default TicTacToe