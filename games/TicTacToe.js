import BaseGame from './BaseGame'


export const GAME_EVENTS = {
	TILE_SELECTED: 'tile-selected'
}


class TicTacToe extends BaseGame {
  constructor(options = {}) {
		super(options)
		this.handleTileSelected = this.handleTileSelected.bind(this)
  }

	handleTileSelected(params) {
		console.log(params)
	}
}

export default TicTacToe