import { GAME_STATES } from "../config/constants"


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
  constructor(options = {}) {
    if (!options.lobbyHash) console.error("No lobby Hash provided")
    if (!options.lobbyId) console.error("No lobby Id provided")
    if (!options.lobbyHash || !options.lobbyId) return null
    // game session metadata
    this.lobbyId = options.lobbyId
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
    this.getMetaData = this.getMetaData.bind(this)
    this.checkState = this.checkState.bind(this)
    
    this.initialize = this.initialize.bind(this)
    this.editGame = this.editGame.bind(this)
    this.endGame = this.endGame.bind(this)

    this.addPlayer = this.addPlayer.bind(this)
    this.removePlayer = this.removePlayer.bind(this)

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
  // gets game session metadata to use and return to client
  getMetaData() {
    return {
      lobbyId: this.lobbyId,
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

  // initalizes game session (handles db and other utils)
  async initialize(options = {}) {
    try {
      // handle db record creation
      if (!this.interval && this.updater && typeof this.updater === 'function') {
        this.interval = setInterval(this.checkState, this.heartbeat)
      }
    } catch (err) {
      console.error(`Failed to initialize game session: ${this.lobbyId} - ${err}`)
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
      console.log(`Failed to update game session: ${this.lobbyId} - ${err}`)
    }
  }

  // handles all end of game db dependencies (db) and ends game
  async endGame(params) {
    try {
      clearInterval(this.interval)
      // update db with all final values
    } catch (err) {
      console.log(`Failed to end game session: ${this.lobbyId} - ${err}`)
    }
  }

  // fetches player data and adds a player to the game
  async addPlayer(userId) {
    try {
      const player = {} // replace with fetch
      if (player) {
        this.players[userId] = player
        return player
      }
      return null
    } catch (err) {
      console.log(`Failed to add player (${userId}) to game session: ${this.lobbyId} - ${this.err}`)
    }
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
      console.log(`Failed to remove player (${userId}) to game session: ${this.lobbyId} - ${this.err}`)
    }
  }
}


export default BaseGame