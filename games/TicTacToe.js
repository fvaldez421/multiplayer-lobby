import { randInt } from '../util/math'
import BaseGame from './BaseGame'
import { GAME_TYPES, COMMON_GAME_EVENTS } from '../config/constants'


export const GAME_EVENTS = {
  PLAYER_MOVE: 'player-move'
}


class TicTacToe extends BaseGame {
  constructor(io, options = {}) {
    super(io, options)
    this.blocks = []
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
    this.turnPlayerId = null
    this.getNextPlayerId = this.getNextPlayerId.bind(this)
    this.handleInitializeGame = this.handleInitializeGame.bind(this)
    this.handlePlayerAdded = this.handlePlayerAdded.bind(this)
    this.handleTileSelected = this.handleTileSelected.bind(this)
  }

  // returns next turn player's user id
  getNextPlayerId() {
    return this.turnPlayerId === this.player1.userId ?
      this.player2.userId : this.player1.userId
  }

  // emits an initialize game update to clients
  handleInitializeGame(data = null) {
    console.log('emit initialize game')
    if (!!data) console.log(`Game reset by: ${data.userId}`)
    this.turnPlayerId = null
    this.blocks = new Array(9).fill(undefined)
    this.emitGameUpdate(
      COMMON_GAME_EVENTS.INITIALIZE,
      {
        players: this.players,
        playerTokens: {
          [this.player1]: this.player1.token,
          [this.player2]: this.player2.token
        },
        mapUpdate: this.blocks
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
        this.handleInitializeGame()
      }
    }
  }

  handleTileSelected(params) {
    if (!this.turnPlayerId) {
      console.log(`No turn player set. Setting ${params.userId} as turn player.`)
      this.turnPlayerId = params.userId
    }
    if (
      params.userId &&
      params.hasOwnProperty('index') &&
      params.userId === this.turnPlayerId
    ) {
      console.log(`Tile ${params.index} selected by ${params.userId}`)
      this.turnPlayerId = this.getNextPlayerId()
      this.blocks[params.index] = this.playerTokens[params.userId]
      this.emitGameUpdate(GAME_EVENTS.PLAYER_MOVE, {
        nextPlayerId: this.turnPlayerId,
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