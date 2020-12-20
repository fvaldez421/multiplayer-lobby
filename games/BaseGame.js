import { GAME_STATES, COMMON_GAME_EVENTS } from "../config/constants"


const {
  DEFAULT,
  IN_LOBBY,
  STARTING,
  IN_PROGRESS,
  ENDED,
  ERROR
} = GAME_STATES

/**
 * Base Game Session instance
 */
class BaseGame {
  constructor(io, options = {}) {
    if (!options.lobbyHash) {
      console.log("No lobby Hash provided")
      return null
    }
    // game session metadata
    this.io = io
    this.lobbyHash = options.lobbyHash
    this.sessionName = options.sessionName
    this.gameType = options.gameType
    // host user id
    this.hostId = options.hostId
    // time game is created
    this.initTime = options.initTime
    // time game is actually started
    this.startTime = options.startTime
    // time game is ended or last player leaves
    this.endTime = options.endTime
    // time game session is terminated
    this.termTime = options.termTime

    // game attributes
    this.status = DEFAULT
    this.players = {}
    this.playerLimit = 10

    // each game instance will have a state checker heartbeat
    // this will help as a fallback in case anyone disconnects
    this.heartbeat = 1000
    this.interval = null
    this.state = {}
    this.lastState = {}

    // optional updater function to be called when there are updates
    this.updater = options.updater
    this.isLive = this.isLive.bind(this)
    this.isEmpty = this.isEmpty.bind(this)
    this.getIo = this.getIo.bind(this)
    this.getMetaData = this.getMetaData.bind(this)
    this.checkState = this.checkState.bind(this)

    this.initialize = this.initialize.bind(this)
    this.editGame = this.editGame.bind(this)
    this.endGame = this.endGame.bind(this)

    this.addPlayer = this.addPlayer.bind(this)
    this.hasPlayer = this.hasPlayer.bind(this)
    this.removePlayer = this.removePlayer.bind(this)
    this.emitGameUpdate = this.emitGameUpdate.bind(this)
    this.emitPlayersUpdate = this.emitPlayersUpdate.bind(this)

    console.log("Successfully created game instance")
  }
  // checks if game is not down
  isLive() {
    return (this.status !== ERROR && this.status !== ENDED)
  }
  // checks if game is empty (no player playing)
  isEmpty() {
    return Object.keys(this.players).length === 0
  }
  // returns io value if assigned
  getIo() {
    return this.io
  }
  // gets game session metadata to use and return to client
  getMetaData() {
    return {
      lobbyHash: this.lobbyHash,
      lobbyHash: this.lobbyHash,
      sessionName: this.sessionName,
      gameType: this.gameType,
      hostId: this.hostId,
      players: this.players,
      status: this.status
    }
  }

  checkState() {
    // overwrites last state
    this.lastState = { ...this.state }
    // updates current state
    this.state = { ...this.state, players: { ...this.players }, status: this.status }
    // stringifies and compares types and primitive values of state
    const state = JSON.stringify(this.state)
    const lastState = JSON.stringify(this.lastState)
    if (state !== lastState) {
      this.updater(this.getMetaData())
    }
  }

  emitGameUpdate(type, data) {
    console.log(`emit game update: ${type} to ${this.lobbyHash}`)
    this.io.to(this.lobbyHash).emit(type, data)
  }

  emitPlayersUpdate({ ...args }) {
    console.log('emit players update')
    this.emitGameUpdate(
      COMMON_GAME_EVENTS.PLAYERS_UPDATE,
      { players: this.players, ...args }
    )
  }

  // initalizes game session (handles db and other utils)
  async initialize(options = {}) {
    try {
      // handle db record creation
      if (!this.interval && this.updater && typeof this.updater === 'function') {
        this.interval = setInterval(this.checkState, this.heartbeat)
      }
    } catch (err) {
      console.error(`Failed to initialize game session: ${this.lobbyHash} - ${err}`)
    }
  }

  // edits game data, this should update the db too
  async editGame(params) {
    try {
      // handle db updates here
      if (params.name) {
        this.sessionName = name
      }
      return this.getMetaData()
    } catch (err) {
      console.log(`Failed to update game session: ${this.lobbyHash} - ${err}`)
    }
  }

  // handles all end of game db dependencies (db) and ends game
  async endGame(params) {
    try {
      clearInterval(this.interval)
      // update db with all final values
    } catch (err) {
      console.log(`Failed to end game session: ${this.lobbyHash} - ${err}`)
    }
  }

  // fetches player data and adds a player to the game
  addPlayer(socket, player) {
    if (socket && player?.userId) {
      if (!this.players[player.userId]) {
        if (Object.keys(this.players).length >= this.playerLimit) {
          console.log(`Lobby full, players: ${Object.keys(this.players).length}/${this.playerLimit}`)
          return null
        }
        this.players[player.userId] = {
          joinedTime: new Date().getTime(),
          ...player
        }
        console.log(`Player: ${player.userId} added to lobby: "${this.lobbyHash}"`)
      } else {
        console.log(`Lobby "${this.lobbyHash}" already has player: ${player.userId}`)
      }
      socket.join(this.lobbyHash)
      this.emitPlayersUpdate()
      return player
    }
    return null
  }
  
  // checks if lobby contains player
  hasPlayer(userId) {
    if (userId) {
      return this.players[userId]
    }
    return false
  }

  // removes player from game
  removePlayer(userId) {
    try {
      const player = this.players[userId]
      if (userId && player) {
        delete this.players[userId]
        return player
      }
      return null
    } catch (err) {
      console.log(`Failed to remove player (${userId}) to game session: ${this.lobbyHash} - ${this.err}`)
    }
  }
}


export default BaseGame