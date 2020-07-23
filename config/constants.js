
export const PORT = process.env.port || 8080;

export const SOCKET_PATH = '/sockets'

export const GAME_TYPES = {
  GAME_TIC_TAC_TOE: 'TIC_TAC_TOE',
}

export const COMMON_GAME_EVENTS = {
  INITIALIZE: 'initialize',
  START_GAME: 'start-game',
  EDIT_GAME: 'edit-game',
  END_GAME: 'end-game',
  JOIN_GAME: 'join-game',
  LEAVE_GAME: 'leave-game',
  GAME_EVENT: 'game-event',
  // to be used once we have chat
  POST_MESSAGE: 'post-message'
}

export const GAME_STATUSES = {
  // before initalized
  DEFAULT: 'DEFAULT',
  // initalized and awaiting players
  IN_LOBBY: 'IN_LOBBY',
  // loading/awaiting for players to connect
  STARTING: 'STARTING',
  // game in progress
  IN_PROGRESS: 'IN_PROGRESS',
  // game ended
  ENDED: 'ENDED',
  // something went wrong...
  ERROR: 'ERROR'
}