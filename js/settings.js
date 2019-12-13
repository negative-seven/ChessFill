function restartButtonClick() {
	game.start()
}

function settingsButtonClick() {
	var settingsPanel = document.getElementById("settings")
	if (settingsPanel.style.display == "none") {
		settingsPanel.style.display = "";
	}
	else {
		settingsPanel.style.display = "none";
	}
}

function boardSizeChange() {
	document.getElementById("boardSizeNumber").innerHTML = document.getElementById("boardSize").value;
}

function spawnChanceChange() {
	document.getElementById("spawnChanceNumber").innerHTML = document.getElementById("spawnChance").value;
}
