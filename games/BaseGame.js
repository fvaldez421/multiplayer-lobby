import { GAME_STATUSES } from "../config/constants"

const {
  DEFAULT,
  IN_LOBBY,
  STARTING,
  IN_PROGRESS,
  ENDED,
  ERROR,
} = GAME_STATUSES

class BaseGame {
  constructor(options = {}) {
    if (!options.lobbyHash) console.error("No lobby Hash provided")
    if (!options.lobbyId) console.error("No lobby Id provided")
    if (!options.lobbyHash || !options.lobbyId) return null
    // configuration attributes
    this.lobbyId = options.lobbyId
    this.lobbyHash = options.lobbyHash
    this.sessionName = options.sessionName
    this.gameType = options.gameType
    this.initTime = options.initTime
    this.startTime = options.startTime
    this.endTime = options.endTime
    this.termTime = options.termTime
    
    // host user id
    this.hostId = options.hostId
    
    // game attributes
    this.status = DEFAULT
    this.players = {}
  }
  isLive() {
    return (this.status !== ERROR && this.status !== ENDED)
  }
}

export default BaseGame