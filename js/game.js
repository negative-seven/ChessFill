class Game {
	static TILE_COUNT_X = 5
	static TILE_COUNT_Y = 5
	static TILE_WIDTH = 64
	static TILE_HEIGHT = 64
	static BORDER_WIDTH = 8

	constructor(canvas) {
		this.board = new Array(Game.TILE_COUNT_X)
		for (var x = 0; x < Game.TILE_COUNT_Y; x++) {
			this.board[x] = new Array(Game.TILE_COUNT_Y)
			for (var y = 0; y < Game.TILE_COUNT_Y; y++) {
				this.board[x][y] = 0
			}
		}
		this.moves = 0

		this.activeDestinationTiles = []

		this.canvas = canvas
		this.context = canvas.getContext("2d")

		this.placeRandomPieces(14)
	}

	update() {
		this.draw()
	}

	move(source, destination) {
		var piece = this.board[source.x][source.y]

		this.board[destination.x][destination.y] = piece
		this.board[source.x][source.y] = 0
		piece.position = destination
		piece.frozen = true

		this.moves++
	}

	onclick(e) {
		var tileCoords = new Position(Math.floor((e.offsetX - Game.BORDER_WIDTH) / Game.TILE_WIDTH), Math.floor((e.offsetY - Game.BORDER_WIDTH) / Game.TILE_HEIGHT))
		var piece = this.board[tileCoords.x][tileCoords.y]

		if (this.selectedPiece && tileCoords.equals(this.selectedPiece.position))
		{
			this.selectedPiece = undefined
			this.activeDestinationTiles = []
		}
		else if (this.activeDestinationTiles.some(i => i.equals(tileCoords)))
		{
			this.move(this.selectedPiece.position, tileCoords)
			this.selectedPiece = undefined
			this.activeDestinationTiles = []

			if (Math.random() < 0.95 )
			{
				this.placeRandomPieces(1)
			}
		}
		else if (tileCoords.x >= 0 && tileCoords.x < Game.TILE_COUNT_X && tileCoords.y >= 0 && tileCoords.y < Game.TILE_COUNT_Y && piece && !piece.frozen) {
			this.selectedPiece = piece
			this.activeDestinationTiles = piece.getDestinationTiles()
		}
		else
		{
			this.selectedPiece = undefined
			this.activeDestinationTiles = []
		}
	}

	draw() {
		this.context.fillStyle = "white"
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)

		this.context.fillStyle = "#808080"
		var boardDimensions = [0, 0, Game.TILE_WIDTH * Game.TILE_COUNT_X + Game.BORDER_WIDTH * 2, Game.TILE_HEIGHT * Game.TILE_COUNT_Y + Game.BORDER_WIDTH * 2]
		this.context.fillRect(...boardDimensions)

		for (var x = 0; x < Game.TILE_COUNT_X; x++) {
			for (var y = 0; y < Game.TILE_COUNT_Y; y++) {
				this.context.fillStyle = (x + y) % 2 ? "#a0a0a0" : "white"

				var tileDimensions = [Game.BORDER_WIDTH + x * Game.TILE_WIDTH, Game.BORDER_WIDTH + y * Game.TILE_HEIGHT, Game.TILE_WIDTH, Game.TILE_HEIGHT]
				this.context.fillRect(...tileDimensions)

				if (this.board[x][y] && this.board[x][y].frozen)
				{
					this.context.fillStyle = "#800000"
					this.context.fillRect(...tileDimensions)
				}

				if (this.activeDestinationTiles.some(i => i.x == x && i.y == y))
				{
					this.context.fillStyle = "#109010c0"
					this.context.fillRect(...tileDimensions)
				}

				if (this.board[x][y]) {
					var imageName

					switch (this.board[x][y].pieceType) {
						case Piece.PieceType.BISHOP:
							imageName = "bishop"
							break
						case Piece.PieceType.KING:
							imageName = "king"
							break
						case Piece.PieceType.KNIGHT:
							imageName = "knight"
							break
						case Piece.PieceType.PAWN:
							imageName = "pawn"
							break
						case Piece.PieceType.QUEEN:
							imageName = "queen"
							break
						case Piece.PieceType.ROOK:
							imageName = "rook"
							break
					}

					imageName += this.board[x][y].isBlack ? "_black" : "_white"

					this.context.drawImage(IMAGES[imageName], ...tileDimensions)
				}
			}
		}

		this.context.fillStyle = "black"
		this.context.font = "30px Arial"
		this.context.fillText("Moves: " + this.moves, 360, 40)
	}

	placeRandomPieces(count) {
		var freeTiles = []
		for (var x = 0; x < Game.TILE_COUNT_X; x++) {
			for (var y = 0; y < Game.TILE_COUNT_Y; y++) {
				if (this.board[x][y] == 0) {
					freeTiles.push(new Position(x, y))
				}
			}
		}

		for (var pieceIndex = 0; pieceIndex < count; pieceIndex++) {
			var positionIndex = Math.floor(Math.random() * freeTiles.length)
			var position = freeTiles[positionIndex]
			freeTiles.splice(positionIndex, 1)
			var color = Math.round(Math.random())

			var pieceChances = [
				[0.18, Piece.PieceType.BISHOP],
				[0.12, Piece.PieceType.KING],
				[0.20, Piece.PieceType.KNIGHT],
				[0.40, Piece.PieceType.PAWN],
				[0.02, Piece.PieceType.QUEEN],
				[0.08, Piece.PieceType.ROOK],
			]
			var pieceRandom = Math.random()
			for (var i of pieceChances)
			{
				if (pieceRandom < i[0])
				{
					var piece = i[1]
					break;
				}

				pieceRandom -= i[0]
			}

			this.board[position.x][position.y] = new Piece(this, position, piece, color)
		}
	}
}