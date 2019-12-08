const IMAGE_PATHS = {
	"bishop_black": "img/bishop_black.png",
	"bishop_white": "img/bishop_white.png",
	"king_black": "img/king_black.png",
	"king_white": "img/king_white.png",
	"knight_black": "img/knight_black.png",
	"knight_white": "img/knight_white.png",
	"pawn_black": "img/pawn_black.png",
	"pawn_white": "img/pawn_white.png",
	"queen_black": "img/queen_black.png",
	"queen_white": "img/queen_white.png",
	"rook_black": "img/rook_black.png",
	"rook_white": "img/rook_white.png",
}

const IMAGES = {}
for (var [name, path] of Object.entries(IMAGE_PATHS)) {
	var image = new Image()
	image.src = path
	IMAGES[name] = image
}
