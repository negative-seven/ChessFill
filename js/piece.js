const PieceType = {
	"BISHOP": 1,
	"KING": 2,
	"KNIGHT": 3,
	"PAWN": 4,
	"QUEEN": 5,
	"ROOK": 6,
}

class Piece {
	constructor(game, position, pieceType, isBlack) {
		this.game = game
		this.pieceType = pieceType
		this.position = position
		this.isBlack = isBlack
		this.frozen = false
	}

	getDestinationTiles() {
		var tiles = []

		switch (this.pieceType) {
			case PieceType.BISHOP:
				for (var vector of [
					new Position(-1, -1),
					new Position(-1, 1),
					new Position(1, -1),
					new Position(1, 1),
				]) {
					for (var steps = 1; steps <= 7; steps++) {
						var position = new Position(this.position.x + vector.x * steps, this.position.y + vector.y * steps)

						if (position.x < 0 || position.x >= TILE_COUNT_X || position.y < 0 || position.y >= TILE_COUNT_Y) {
							break
						}

						tiles.push(position)

						if (this.game.board[position.x][position.y]) {
							break
						}
					}
				}
				break

			case PieceType.KING:
				tiles.push(new Position(this.position.x - 1, this.position.y))
				tiles.push(new Position(this.position.x + 1, this.position.y))
				tiles.push(new Position(this.position.x, this.position.y - 1))
				tiles.push(new Position(this.position.x, this.position.y + 1))
				tiles.push(new Position(this.position.x - 1, this.position.y - 1))
				tiles.push(new Position(this.position.x - 1, this.position.y + 1))
				tiles.push(new Position(this.position.x + 1, this.position.y - 1))
				tiles.push(new Position(this.position.x + 1, this.position.y + 1))
				break

			case PieceType.KNIGHT:
				tiles.push(new Position(this.position.x - 2, this.position.y - 1))
				tiles.push(new Position(this.position.x - 2, this.position.y + 1))
				tiles.push(new Position(this.position.x + 2, this.position.y - 1))
				tiles.push(new Position(this.position.x + 2, this.position.y + 1))
				tiles.push(new Position(this.position.x - 1, this.position.y - 2))
				tiles.push(new Position(this.position.x - 1, this.position.y + 2))
				tiles.push(new Position(this.position.x + 1, this.position.y - 2))
				tiles.push(new Position(this.position.x + 1, this.position.y + 2))
				break

			case PieceType.PAWN:
				for (var position of [
					new Position(this.position.x - 1, this.position.y),
					new Position(this.position.x + 1, this.position.y),
					new Position(this.position.x, this.position.y - 1),
					new Position(this.position.x, this.position.y + 1),
				]) {
					if (position.x >= 0 && position.x < TILE_COUNT_X && position.y >= 0 && position.y < TILE_COUNT_Y && !this.game.board[position.x][position.y]) {
						tiles.push(position)
					}
				}

				for (var position of [
					new Position(this.position.x - 1, this.position.y - 1),
					new Position(this.position.x - 1, this.position.y + 1),
					new Position(this.position.x + 1, this.position.y - 1),
					new Position(this.position.x + 1, this.position.y + 1),
				]) {
					if (position.x >= 0 && position.x < TILE_COUNT_X && position.y >= 0 && position.y < TILE_COUNT_Y && this.game.board[position.x][position.y]) {
						tiles.push(position)
					}
				}
				break

			case PieceType.QUEEN:
				for (var vector of [
					new Position(-1, -1),
					new Position(-1, 1),
					new Position(1, -1),
					new Position(1, 1),
					new Position(-1, 0),
					new Position(1, 0),
					new Position(0, -1),
					new Position(0, 1)
				]) {
					for (var steps = 1; steps <= 7; steps++) {
						var position = new Position(this.position.x + vector.x * steps, this.position.y + vector.y * steps)

						if (position.x < 0 || position.x >= TILE_COUNT_X || position.y < 0 || position.y >= TILE_COUNT_Y) {
							break
						}

						tiles.push(position)

						if (this.game.board[position.x][position.y]) {
							break
						}
					}
				}
				break

			case PieceType.ROOK:
				for (var vector of [
					new Position(-1, 0),
					new Position(1, 0),
					new Position(0, -1),
					new Position(0, 1)
				]) {
					for (var steps = 1; steps <= 7; steps++) {
						var position = new Position(this.position.x + vector.x * steps, this.position.y + vector.y * steps)

						if (position.x < 0 || position.x >= TILE_COUNT_X || position.y < 0 || position.y >= TILE_COUNT_Y) {
							break
						}

						tiles.push(position)

						if (this.game.board[position.x][position.y]) {
							break
						}
					}
				}
				break
		}

		for (var tileIndex = tiles.length - 1; tileIndex >= 0; tileIndex--) {
			var tile = tiles[tileIndex]
			if (tile.x < 0 || tile.x >= TILE_COUNT_X || tile.y < 0 || tile.y >= TILE_COUNT_Y || this.game.board[tile.x][tile.y].isBlack == this.isBlack) {
				tiles.splice(tileIndex, 1)
			}
		}

		return tiles
	}
}