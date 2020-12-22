
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
  COMPLETE_GAME: 'complete-game',
  RESET_GAME: 'reset-game',
  JOIN_GAME: 'join-game',
  LEAVE_GAME: 'leave-game',
  PLAYERS_UPDATE: 'players-update',
	GAME_STATUS_UPDATE:	'game-status-update',
  // to be used once we have chat
  POST_MESSAGE: 'post-message'
}

export const GAME_STATES = {
  // before initalized
  DEFAULT: 'default',
  // initalized and awaiting players
  IN_LOBBY: 'in-lobby',
  // loading/awaiting for players to connect
  STARTING: 'starting',
  // game in progress
  IN_PROGRESS: 'in-progress',
  // game ended
  COMPLETE: 'complete',
  // something went wrong...
  ERROR: 'error'
}