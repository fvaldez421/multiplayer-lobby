import BaseGame from './BaseGame'
import { GAME_TYPES, COMMON_GAME_EVENTS, GAME_STATES } from '../config/constants'


export const GAME_EVENTS = {
  PLAYER_MOVE: 'player-move'
}

const [
  PLAYER_1_TOKEN,
  PLAYER_2_TOKEN
] = ['x', 'o']

const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

class TicTacToe extends BaseGame {
  constructor(io, options = {}) {
    super(io, options)
    this.blocks = []
    this.socketStatus = 'default'
    this.gameStatus = GAME_STATES.DEFAULT
    this.gameType = GAME_TYPES.GAME_TIC_TAC_TOE
    this.players = {}
    this.playerTokens = {}
    this.playerLimit = 2
    this.player1 = null
    this.player2 = null
    this.turnPlayerId = null
    this.winnerId = null
    this.getNextPlayerId = this.getNextPlayerId.bind(this)
    this.handleInitializeGame = this.handleInitializeGame.bind(this)
    this.handlePlayerAdded = this.handlePlayerAdded.bind(this)
    this.checkGameState = this.checkGameState.bind(this)
    this.handleTileSelected = this.handleTileSelected.bind(this)
  }

  // returns next turn player's user id
  getNextPlayerId() {
    return this.turnPlayerId === this.player1?.userId ?
      this.player2?.userId : this.player1?.userId
  }

  // emits an initialize game update to clients
  handleInitializeGame(data = null) {
    console.log('emit initialize game')
    if (!!data) console.log(`Game reset by: ${data.userId}`)
    this.turnPlayerId = null
    this.winnerId = null
    this.blocks = new Array(9).fill(undefined)
    this.gameStatus = GAME_STATES.IN_PROGRESS
    this.emitGameUpdate(
      COMMON_GAME_EVENTS.INITIALIZE,
      {
        resetPlayerId: data?.userId && data.userId,
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
    const addedPlayer = this.addPlayer(socket, player)
    if (!hadPlayer && addedPlayer && (!this.player1 || !this.player2)) {
      // attempt adding player
      if (!this.player1) {
        this.player1 = { ...player, token: PLAYER_1_TOKEN }
        this.playerTokens[player.userId] = PLAYER_1_TOKEN
      } else if (this.player1 && !this.player2) {
        this.player2 = { ...player, token: PLAYER_2_TOKEN }
        this.playerTokens[player.userId] = PLAYER_2_TOKEN
      }
      // if last player added
      if (this.player1 && this.player2) {
        this.handleInitializeGame()
      }
    // if a player rejoins an existing session, send map update
    } else if (
      hadPlayer && 
      addedPlayer && 
      this.gameStatus === GAME_STATES.IN_PROGRESS
    ) {
      this.emitGameUpdate(COMMON_GAME_EVENTS.GAME_STATUS_UPDATE, {
        winnerId: this.winnerId,
        nextPlayerId: this.turnPlayerId,
        mapUpdate: this.blocks
      })
    }
  }

  // checks for wins/game end
  checkGameState() {
    let winnerId = null
    for (let i = 0; i < winCombos.length; i++) {
      const combo = winCombos[i]
      if (
        this.blocks[combo[0]] === PLAYER_1_TOKEN &&
        this.blocks[combo[1]] === PLAYER_1_TOKEN &&
        this.blocks[combo[2]] === PLAYER_1_TOKEN
      ) {
        winnerId = this.player1.userId
      } else if (
        this.blocks[combo[0]] === PLAYER_2_TOKEN &&
        this.blocks[combo[1]] === PLAYER_2_TOKEN &&
        this.blocks[combo[2]] === PLAYER_2_TOKEN
      ) {
        winnerId = this.player2.userId
      }
    }
    if (winnerId) {
      this.winnerId = winnerId
      console.log(`Game complete, winner: ${winnerId}`)
      this.emitGameUpdate(
        COMMON_GAME_EVENTS.COMPLETE_GAME,
        { winnerId, winnerData: this.players[winnerId] }
      )
    }
  }

  // handles when player tile selection
  handleTileSelected(params) {
    if (this.gameStatus !== GAME_STATES.IN_PROGRESS) {
      console.log('Turn attempted but game not yet initialized')
      return
    }
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
      this.checkGameState()
    } else {
      console.log(`Invalid userId: ${params.userId} or index: ${params.index}`)
    }
  }
}

export default TicTacToe