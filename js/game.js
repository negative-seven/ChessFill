class Game {
	constructor(canvas) {
		this.canvas = canvas
		this.context = canvas.getContext("2d")

		this.start()
	}

	start() {
		this.boardSize = parseInt(document.getElementById("boardSize").value);
		this.pieceSpawnChance = parseInt(document.getElementById("spawnChance").value);

		this.board = new Array(this.boardSize)
		for (var x = 0; x < this.boardSize; x++) {
			this.board[x] = new Array(this.boardSize)
			for (var y = 0; y < this.boardSize; y++) {
				this.board[x][y] = 0
			}
		}

		this.moves = 0
		document.getElementById("moveCounter").innerText = ("Moves: 0")
		this.selectedPiece = undefined
		this.activeDestinationTiles = []

		this.placeRandomPieces(Math.ceil(this.boardSize * this.boardSize / 2) + 1)
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
		document.getElementById("moveCounter").innerText = ("Moves: " + this.moves)
	}

	onclick(e) {
		var borderWidth = this.canvas.width / (this.boardSize * 4 + 2);
		var tileWidth = borderWidth * 4;
		var tileHeight = tileWidth;

		var tileCoords = new Position(Math.floor((e.offsetX - borderWidth) / tileWidth), Math.floor((e.offsetY - borderWidth) / tileHeight))
		var piece = this.board[tileCoords.x][tileCoords.y]

		if (this.selectedPiece && tileCoords.equals(this.selectedPiece.position)) {
			this.selectedPiece = undefined
			this.activeDestinationTiles = []
		}
		else if (this.activeDestinationTiles.some(i => i.equals(tileCoords))) {
			this.move(this.selectedPiece.position, tileCoords)
			this.selectedPiece = undefined
			this.activeDestinationTiles = []

			if (Math.random() < this.pieceSpawnChance) {
				this.placeRandomPieces(1)
			}
		}
		else if (tileCoords.x >= 0 && tileCoords.x < this.boardSize && tileCoords.y >= 0 && tileCoords.y < this.boardSize && piece && !piece.frozen) {
			this.selectedPiece = piece
			this.activeDestinationTiles = piece.getDestinationTiles()
		}
		else {
			this.selectedPiece = undefined
			this.activeDestinationTiles = []
		}
	}

	draw() {
		var borderWidth = this.canvas.width / (this.boardSize * 4 + 2);
		var tileWidth = borderWidth * 4;
		var tileHeight = tileWidth;

		this.context.fillStyle = "white"
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)

		this.context.fillStyle = "#808080"
		var boardDimensions = [0, 0, tileWidth * this.boardSize + borderWidth * 2, tileHeight * this.boardSize + borderWidth * 2]
		this.context.fillRect(...boardDimensions)

		for (var x = 0; x < this.boardSize; x++) {
			for (var y = 0; y < this.boardSize; y++) {
				this.context.fillStyle = (x + y) % 2 ? "#a0a0a0" : "white"

				var tileDimensions = [borderWidth + x * tileWidth, borderWidth + y * tileHeight, tileWidth, tileHeight]
				this.context.fillRect(...tileDimensions)

				if (this.board[x][y] && this.board[x][y].frozen) {
					this.context.fillStyle = "#800000"
					this.context.fillRect(...tileDimensions)
				}

				if (this.activeDestinationTiles.some(i => i.x == x && i.y == y)) {
					this.context.fillStyle = "rgba(16, 144, 16, 0.75)"
					this.context.fillRect(...tileDimensions)
				}

				if (this.board[x][y]) {
					var imageName

					switch (this.board[x][y].pieceType) {
						case PieceType.BISHOP:
							imageName = "bishop"
							break
						case PieceType.KING:
							imageName = "king"
							break
						case PieceType.KNIGHT:
							imageName = "knight"
							break
						case PieceType.PAWN:
							imageName = "pawn"
							break
						case PieceType.QUEEN:
							imageName = "queen"
							break
						case PieceType.ROOK:
							imageName = "rook"
							break
					}

					imageName += this.board[x][y].isBlack ? "_black" : "_white"

					this.context.drawImage(IMAGES[imageName], ...tileDimensions)
				}
			}
		}
	}

	placeRandomPieces(count) {
		var freeTiles = []
		for (var x = 0; x < this.boardSize; x++) {
			for (var y = 0; y < this.boardSize; y++) {
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
				[0.18, PieceType.BISHOP],
				[0.12, PieceType.KING],
				[0.20, PieceType.KNIGHT],
				[0.40, PieceType.PAWN],
				[0.02, PieceType.QUEEN],
				[0.08, PieceType.ROOK],
			]
			var pieceRandom = Math.random()
			for (var i of pieceChances) {
				if (pieceRandom < i[0]) {
					var piece = i[1]
					break
				}

				pieceRandom -= i[0]
			}

			this.board[position.x][position.y] = new Piece(this, position, piece, color)
		}
	}
}