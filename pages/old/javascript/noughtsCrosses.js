var crossURL = "../images/cross.png";
var noughtURL = "../images/nought.png";
var grid = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var numMoves = 0;

function checkValidSquare(id) {
	if (numMoves != 9) {	
		if ((id.substr(0,2) == "td") && (grid[id.substr(2,1)-1] == 0)) { 
			grid[id.substr(2,1)-1] = 1;		
			var imgVar = "img" + id.substr(2,1);
			$("#" + imgVar).attr({src: crossURL, style: "width:98px"});
			numMoves = numMoves + 1;
			if (numMoves>4) {
				checkWin();
			}
			computerMove();

		}
	}
}

function computerMove() {
	if (numMoves != 9) {
		if (numMoves>2) { var k = doubleCheck();} else {var k = 0;}		// check if we need to doublecheck
		
		if (k != 0) { var p = k;
		} else if ((grid[4] == 0) && (Math.random() < 0.8)) { var p = 4;		// take middle square if free most of the time
		} else {do {var p = Math.floor((Math.random()*9));}	while (grid[p] != 0);
		}

		// old plain one:$("#img" + (p+1)).attr({src: noughtURL, style: "width:98px"});		

		$("#idiv" + (p+1)).fadeOut('10', function(){						// does fade! note fade out div 1st
			$("#img" + (p+1)).attr({src: noughtURL, style: "width:98px"});
			$("#idiv" + (p+1)).fadeIn(300);
		});


		grid[p] = -1;
		numMoves = numMoves + 1;
		if (numMoves>4) {
			checkWin();
		}
	}
}

function doubleCheck() {
	var k = 0;
	var q = Math.random();
	if (q < 0.25) { return k; }				// sometime computer misses things totally
	else if (q < 0.50) { k = hvdCheck(); }	// horiz / vertical / diag check
	else if (q < 0.75) { k = dhvCheck(); }	// diag / horiz / vertical check
	else { k = vdhCheck(); }	// vertical / diag / horiz check

	return k;
}

function hvdCheck() {
	var k = hCheck();
	if (k != 0) { return k; 
	} else { 
		k = vCheck();
		if (k != 0) { return k;
		} else {
		k = dCheck();
		return k;
		}
	}
}

function dhvCheck() {
	var k = dCheck();
	if (k != 0) { return k; 
	} else { 
		k = hCheck();
		if (k != 0) { return k;
		} else {
		k = vCheck();
		return k;
		}
	}
}

function vdhCheck() {
	var k = vCheck();
	if (k != 0) { return k; 
	} else { 
		k = dCheck();
		if (k != 0) { return k;
		} else {
		k = hCheck();
		return k;
		}
	}
}

function hCheck() {
	var n = Math.random();
	if (n < 0.33) {
		if (Math.abs(grid[0] + grid[3] + grid[6]) == 2) {
			var q = getMove(0, 3, 6);
			return q;
		} else if (Math.abs(grid[1] + grid[4] + grid[7]) == 2) {
			var q = getMove(1, 4, 7);
			return q;
		} else if (Math.abs(grid[2] + grid[5] + grid[8]) == 2) {
			var q = getMove(2, 5, 8);
			return q;
		} else return 0;
	} else if (n < 0.66) {
		if (Math.abs(grid[1] + grid[4] + grid[7]) == 2) {
			var q = getMove(1, 4, 7);
			return q;
		} else if (Math.abs(grid[2] + grid[5] + grid[8]) == 2) {
			var q = getMove(2, 5, 8);
			return q;
		} else if (Math.abs(grid[0] + grid[3] + grid[6]) == 2) {
			var q = getMove(0, 3, 6);
			return q;
		} else return 0;
	} else {
		if (Math.abs(grid[2] + grid[5] + grid[8]) == 2) {
			var q = getMove(2, 5, 8);
			return q;
		} else if (Math.abs(grid[0] + grid[3] + grid[6]) == 2) {
			var q = getMove(0, 3, 6);
			return q;
		} else if (Math.abs(grid[1] + grid[4] + grid[7]) == 2) {
			var q = getMove(1, 4, 7);
			return q;
		} else return 0;
	}
}

function vCheck() {
	var n = Math.random();
	if (n < 0.33) {
		if (Math.abs(grid[0] + grid[1] + grid[2]) == 2) {
			var q = getMove(0, 1, 2);
			return q;
		} else if (Math.abs(grid[3] + grid[4] + grid[5]) == 2) {
			var q = getMove(3, 4, 5);
			return q;
		} else if (Math.abs(grid[6] + grid[7] + grid[8]) == 2) {
			var q = getMove(6, 7, 8);
			return q;
		} else return 0;
	} else if (n < 0.66) {
		if (Math.abs(grid[3] + grid[4] + grid[5]) == 2) {
			var q = getMove(3, 4, 5);
			return q;
		} else if (Math.abs(grid[6] + grid[7] + grid[8]) == 2) {
			var q = getMove(6, 7, 8);
			return q;
		} else if (Math.abs(grid[0] + grid[1] + grid[2]) == 2) {
			var q = getMove(0, 1, 2);
			return q;
		} else return 0;
	} else {
		if (Math.abs(grid[6] + grid[7] + grid[8]) == 2) {
			var q = getMove(6, 7, 8);
			return q;
		} else if (Math.abs(grid[0] + grid[1] + grid[2]) == 2) {
			var q = getMove(0, 1, 2);
			return q;
		} else if (Math.abs(grid[3] + grid[4] + grid[5]) == 2) {
			var q = getMove(3, 4, 5);
			return q;
		} else return 0;
	}
}

function dCheck() {
	var n = Math.random();
	if (n < 0.5) {
		if (Math.abs(grid[0] + grid[4] + grid[8]) == 2) {
			var q = getMove(0, 4, 8);
			return q;
		} else if (Math.abs(grid[2] + grid[4] + grid[6]) == 2) {
			var q = getMove(2, 4, 6);
			return q;
		} else return 0;
	} else {
		if (Math.abs(grid[2] + grid[4] + grid[6]) == 2) {
			var q = getMove(2, 4, 6);
			return q;
		} else if (Math.abs(grid[0] + grid[4] + grid[8]) == 2) {
			var q = getMove(0, 4, 8);
			return q;
		} else return 0;
	}
}

function getMove(a, b, c) {
	if (grid[a] == 0) {return a;} else if (grid[b] == 0) {return b;} else {return c;}
}

function checkWin() {
	if (Math.abs(grid[0] + grid[1] + grid[2]) == 3) {
		showWin(1, 2, 3);
	} else if (Math.abs(grid[3] + grid[4] + grid[5]) == 3) {
		showWin(4, 5, 6);
	} else if (Math.abs(grid[6] + grid[7] + grid[8]) == 3) {
		showWin(7, 8, 9);
	} else if (Math.abs(grid[0] + grid[3] + grid[6]) == 3) {
		showWin(1, 4, 7);
	} else if (Math.abs(grid[1] + grid[4] + grid[7]) == 3) {
		showWin(2, 5, 8);
	} else if (Math.abs(grid[2] + grid[5] + grid[8]) == 3) {
		showWin(3, 6, 0);
	} else if (Math.abs(grid[0] + grid[4] + grid[8]) == 3) {
		showWin(1, 5, 9);
	} else if (Math.abs(grid[2] + grid[4] + grid[6]) == 3) {
		showWin(3, 5, 7);
	}

}

function showWin(a, b, c) {
	var dt = 500 * ((numMoves-1) % 2) + 1;			// timeout only if computer wins

	setTimeout(function () {	
		$("#td" + a).attr({style: "background:#9b88c6; width:100px;"});
		$("#td" + b).attr({style: "background:#9b88c6; width:100px;"});
		$("#td" + c).attr({style: "background:#9b88c6; width:100px;"});
	}, dt);
	numMoves = 9;		// make sure can't do anymore moves
}

function resetGrid() {
	grid = [0, 0, 0, 0, 0, 0, 0, 0, 0];
	numMoves = 0;
	for (j = 1; j < 10; j++) { 
		$("#img" + j).attr({style: "display:none"}); // "src", ""); at first, didn't work for chrome or old safari
			if (j % 2 == 0) { $("#td" + j).attr({style: "background:#9bbbc6; width:100px;"});
			} else { $("#td" + j).attr({style: "background:#6dbbc6; width:100px;"})
			}
	}
}
