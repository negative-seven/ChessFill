var canvas = document.getElementById("canvas")
game = new Game(canvas)

setInterval(() => game.update(), 1000 / 15)
canvas.addEventListener('click', e => game.onclick(e))
