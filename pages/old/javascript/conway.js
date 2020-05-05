/* game of life...

Every cell interacts with its eight neighbours, which are the cells that are horizontally, vertically, or diagonally adjacent. At each step in time, the following transitions occur:

    Any live cell with fewer than two live neighbours dies, as if caused by under-population.
    Any live cell with two or three live neighbours lives on to the next generation.
    Any live cell with more than three live neighbours dies, as if by overcrowding.
    Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

The initial pattern constitutes the seed of the system. The first generation is created by applying the above rules simultaneously to every cell in the seed—births and deaths occur simultaneously, and the discrete moment at which this happens is sometimes called a tick (in other words, each generation is a pure function of the preceding one). The rules continue to be applied repeatedly to create further generations
*/

/*
symmetry option for self-drawn???
*/

function init() {
	if (typeof Storage === "undefined") { alert("No browser storage - stuff won't work properly."); }
	sessionStorage.clear();
	sessionStorage.setItem("reset", "true");
	sessionStorage.setItem("gridSet", "false");
	sessionStorage.setItem("pause", "false");
	sessionStorage.setItem("dSpeed", "false");
	canvas = document.getElementById("theCanvas");
	context = canvas.getContext("2d");
	canvas.addEventListener("mousedown", clickHandler, false);
	density = 0.75;			// default
	interval = 400;			// default
	drawBase();
}

function startGOL() {
// start GoL
	sessionStorage.setItem("inProgress", "true");
	nextTick();
	drawGOL();
	
	var check = sessionStorage.getItem("reset");	
	if (check == "true") {
		sessionStorage.setItem("reset", "false");		
		clearTimeout(timer);	
	}
	
	var check2 = sessionStorage.getItem("dSpeed");
	if (check2 == "true") {
		sessionStorage.setItem("dSpeed", "false");
		timer = setTimeout(function(){startGOL();}, interval);	// new interval
	} else {
		timer = setTimeout(function(){startGOL();}, interval);	// same interval
	}


}

function genGOL() {
// button click to make a random  GoL distribution
	
	for (var i = 0; i < (2500); i++) {
		if (Math.random() > density) { liveArray[i] = 1; }
		else {	liveArray[i] = 0; } 
	}

	drawGOL();
}

function resetGOL() {
// button click to set reset flag - i.e. stop current GoL & reset
	sessionStorage.setItem("reset", "true");
	sessionStorage.setItem("inProgress", "false");
	sessionStorage.setItem("gridSet", "false");
	sessionStorage.setItem("pause", "false");
	sessionStorage.setItem("dSpeed", "false");
	clearTimeout(timer);
	density = 0.75;
	interval = 400;
	context.clearRect(0, 0, 450, 400);
	zeroArray(liveArray);
	drawBase();
}

function drawGOL() {
	context.clearRect(0, 0, 450, 400);
	drawBase();
	for (var y = 0; y < 50; y++) {
		for (var x = 0; x < 50; x++) {
			if (liveArray[x + 50*y] > 0) {
				drawCell(8*x, 8*y);
			}
		}
	}
}
	
function drawCell(x, y) {
	context.beginPath();
	context.rect(x+50, y, 8, 8); //x y width height
	context.fillStyle = '#88b1bf';
	context.fill();
	/*context.lineWidth = 1;
	context.strokeStyle = '#9bbbc6';
	context.stroke();*/
	context.closePath();
}

function clickHandler(event) {
	// get coords of click
	var coords = getPos(event);
	var check = sessionStorage.getItem("inProgress");
	if (coords[0] > 50) {							// not in menu
		if (check != "true") {							// no clicks if in progress
			var x = Math.floor((coords[0] - 50) / 8); 
			var y = Math.floor(coords[1] / 8);

			if(liveArray.length === 0) { zeroArray(liveArray);}			// allocate all of liveArray if not happened already

			if (liveArray[x + 50*y] == 1) {
				// erase cell
				liveArray[x + 50*y] = 0;
				drawBase();
				drawGOL();	
				//context.clearRect((8*x)+50, (8*y), 8, 8); //x y width height unDrawCell(8*x, 8*y);			
		
			} else {
				liveArray[x + 50*y] = 1;
				drawCell(8*x, 8*y);	
			}	
		}			
	}

	else if (coords[1] < 50) {			// menu events
		// start or pause
		var check3 = sessionStorage.getItem("pause")
		if (check != "true") { startGOL(); }
		else if (check3 == "false") { sessionStorage.setItem("pause", "true"); }
		else if (check3 == "true") { sessionStorage.setItem("pause", "false"); }
	}
	else if ((coords[1] < 100) && (check != "true")) {	
		genGOL();
	}
	else if ((coords[1] > 99) && (coords[1] < 150)) {
		var check2 = sessionStorage.getItem("gridSet");
		if (check2 != "true") {
			sessionStorage.setItem("gridSet", "true");
			{ drawGrid(); }	// re-draw with grid
		} else { 
			sessionStorage.setItem("gridSet", "false");  // turn off grid, redraw if not in progress
			if (check != "true") {
			drawBase();
			drawGOL();
			}
		}
	}
	else if ((coords[1] > 149) && (coords[1] < 200)) {
		resetGOL();
	}
	else if ((coords[1] > 200 ) && (coords[1] < 230) && (check != "true")) {
		if ((coords[0] < 25) && (density > 0.05)) { density = density - 0.05; } 
		else if ((coords[0] > 24) && (density < 0.95)) { density = density + 0.05; }
		//genGOL();		// new one with new density		
		drawBase();
		drawGOL();	
	}
	else if ((coords[1] > 250) && (coords[1] < 280)) {
		if ((coords[0] < 25) && (interval > 50)) { interval = interval - 75; } 
		else if ((coords[0] > 24) && (interval < 800)) { interval = interval + 75; }
		sessionStorage.setItem("dSpeed", "true");
		if (check != "true" ) { 
			drawBase();
			drawGOL();
		}												
	}
	else if ((coords[1] > 299) && (coords[1] < 350)) {
		gliderGun();
		drawBase();
		drawGOL();
	}
	else if (coords[1] > 350) {		// 34P13 oscillator
		oscillator();
		drawBase();
		drawGOL();
	}

}

function getPos(event) {
// old familiar
	var coords = [0, 0];
	var contain = document.getElementById("canvasArea"); // extra offset, otherwise does offset only wrt containing element
    
	if (event.pageX || event.pageY) {
      coords[0] = event.pageX;
      coords[1] = event.pageY;
    } else {
      coords[0] = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      coords[1] = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
	coords[0] -= (canvas.offsetLeft); // redesign made this go weird, obv. this term wrong: + contain.offsetLeft); 
	coords[1] -= canvas.offsetTop;
	return coords;
}

function turnOff() {
// turn off buttons (not reset) (to be obsolete)
	canvas.removeEventListener("mousedown", clickHandler, false);
	document.getElementById("startButton").disabled = true;
	document.getElementById("generateButton").disabled = true;
}

function turnOn() {
// turn on buttons (not reset)
	canvas.addEventListener("mousedown", clickHandler, true);
	document.getElementById("startButton").disabled = false;
	document.getElementById("generateButton").disabled = false;
}

function zeroArray(liveArray) {
	for (var i = 0; i < 2500; i++) { liveArray[i] = 0; }
}

function nextTick() {
// in loop, any x, y = 1 or 50 [0 or 49] then need to take into account outside!
// do nothing if pause
var check = sessionStorage.getItem("pause");
if (check == "false") {
	var tempArray = [];

	// go through cells
	for (var y = 0; y < 50; y++) {	
		for (var x = 0; x < 50; x++) {
			var k = x + 50*y;
			// calculate num
			var num = sumNeighbours(x, y, k);
			if (liveArray[k] > 0) {
			// live cell case
				if ((num == 2) || (num == 3)) {
					// stay alive
					tempArray[k] = 1;
				} else {
					// death by overcrowding
					tempArray[k] = 0;
				}
		
			} else {
			// dead cell case
				if (num == 3) {
				// birth
				tempArray[k] = 1;
				} else {
				// empty
				tempArray[k] = 0;
				}
			}
		}
	}

	// replace old values with temp (i.e. new) values
	
	for (var i = 0; i < 2500; i++) { liveArray[i] = tempArray[i]; }
	
	tempArray.length = 0;		// empty just to be tidy
	}
}

function sumNeighbours(x, y, k) {
// sum neighbours

// make closed toroidal

	var num = 0;
	if (x == 0) {
		if (y == 0) {
		num = num + liveArray[k+1] + liveArray[k+50] + liveArray[k+51] +
					liveArray[k+49] + liveArray[k+99] + liveArray[2450] + liveArray[2451] + liveArray[2499]; // toroidal terms
		} else if (y == 49) {
		num = num + liveArray[k-50] + liveArray[k-49] + liveArray[k+1] +
					liveArray[k-1] + liveArray[2499] + liveArray[0] + liveArray[1] + liveArray[49]; // toroidal terms
		} else {
		num = num + liveArray[k-50] + liveArray[k-49] + liveArray[k+1] + liveArray[k+50] + liveArray[k+51] +
					liveArray[k-1] + liveArray[k+49] + liveArray[k+99]; // toroidal terms
		}
	} else if (x == 49) {
		if (y == 0) {
		num = num + liveArray[k-1] + liveArray[k+49] + liveArray[k+50] +
					liveArray[0] + liveArray[k+1] + liveArray[2450] + liveArray[2498] + liveArray[2499]; // toroidal terms
		} else if (y == 49) {
		num = num + liveArray[k-51] + liveArray[k-50] + liveArray[k-1] +
					liveArray[0] + liveArray[k-99] + liveArray[k-49] + liveArray[48] + liveArray[49]; // toroidal terms
		} else {
		num = num + liveArray[k-51] + liveArray[k-50] + liveArray[k-1] + liveArray[k+49] + liveArray[k+50] +
					liveArray[k+1] + liveArray[k-49] + liveArray[k-99]; // toroidal terms
		}
	} else if (y == 0) { 
		num = num + liveArray[k-1] + liveArray[k+1] + liveArray[k+49] + liveArray[k+50] + liveArray[k+51] +
					liveArray[2449+x] + liveArray[2450+x] + liveArray[2451+x]; // toroidal terms
	} else if (y == 49) {
		num = num + liveArray[k-51] + liveArray[k-50] + liveArray[k-49] + liveArray[k-1] + liveArray[k+1] +
					liveArray[x-1] + liveArray[x] + liveArray[x+1]; // toroidal terms
	} else {
		num = num + liveArray[k-51] + liveArray[k-50] + liveArray[k-49] + liveArray[k-1]
					+ liveArray[k+1] + liveArray[k+49] + liveArray[k+50] + liveArray[k+51];
	}
	return num;
}

function drawBase() {

	context.clearRect(0, 0, 450, 400);	
// boundary line
	context.beginPath();
	context.moveTo(49, 0);
	context.lineTo(49, 400);
	context.lineWidth = 1;
	context.strokeStyle = '#9bbbc6';
	context.stroke();
	context.closePath();
// divisors
	for (var i = 0; i < 7; i++) {
		context.beginPath();
		context.moveTo(0, 50*(i+1));
		context.lineTo(49, 50*(i+1));
		context.lineWidth = 1;
		context.strokeStyle = '#9bbbc6';
		context.stroke();
		context.closePath();
	}
// start symbol
	var check = sessionStorage.getItem("inProgress");
	var check3 = sessionStorage.getItem("pause")
	if ((check == "true") && (check3 != "true")) {
		// draw pause button
		context.beginPath();
		context.rect(10, 10, 10, 30);
		context.rect(28, 10, 10, 30);	
		context.fillStyle = '#9bbbc6';
		context.fill();
		context.strokeStyle = '#9bbbc6';
		context.stroke();
		context.closePath();
	} else if ((check == "true") && (check3 == "true")) {
		// paused
		context.beginPath();
		context.rect(10, 10, 4, 30);

		context.moveTo(18, 10);
		context.lineTo(18, 40);
		context.lineTo(38, 25);
		context.lineTo(18, 10);

		context.fillStyle = '#9bbbc6';
		context.fill();
		context.strokeStyle = '#9bbbc6';
		context.stroke();
		context.closePath();
	} else	{
		// triangle
		context.moveTo(12, 10);
		context.lineTo(12, 40);
		context.lineTo(38, 25);
		context.lineTo(12, 10);
		context.fillStyle = '#9bbbc6';
		context.strokeStyle = '#9bbbc6';
		context.fill();		
		context.stroke();
		context.closePath();
	}

// random symbol, in [0, 50] - [49, 100]
// relate to density indicator!!! define array - then write from [0]th up to [n]th
	var p = (1 - density) * 50;	
	context.beginPath();
	for (var q = 0; q < p; q++) {	
		var cds = getMenuRandom(q);	
		context.rect(cds[0], cds[1], 3, 3);

	}
	context.fillStyle = '#9bbbc6';
	context.fill();
	context.strokeStyle = '#9bbbc6';
	context.stroke();
	context.closePath();


// grid symbol
	for (var i = 0; i < 5; i++) {
		context.beginPath();
		context.moveTo(0, 109+(8*i));
		context.lineTo(49, 109+(8*i));
		context.lineWidth = 1;
		context.strokeStyle = '#9bbbc6';
		context.stroke();
		context.closePath();

		context.beginPath();
		context.moveTo(9+(8*i), 100);
		context.lineTo(9+(8*i), 150);
		context.lineWidth = 1;
		context.strokeStyle = '#9bbbc6';
		context.stroke();
		context.closePath();
	}
// reset symbol
	context.beginPath();
	context.arc(24, 177, 12, 1.7*Math.PI, 0.5*Math.PI);
	context.lineWidth = 4;
	context.strokeStyle = '#9bbbc6';
	context.stroke();
	context.closePath();
	
	context.beginPath();
	context.arc(24, 177, 12, 0.7*Math.PI, 1.5*Math.PI);
	context.lineWidth = 4;
	context.strokeStyle = '#9bbbc6';
	context.stroke();
	context.closePath();

	context.beginPath();
	context.moveTo(16, 160);
	context.lineTo(25, 166);
	context.lineWidth = 4;
	context.strokeStyle = '#9bbbc6';
	context.stroke();
	context.closePath();

	context.beginPath();
	context.moveTo(19, 174);
	context.lineTo(24, 164);
	context.lineWidth = 4;
	context.strokeStyle = '#9bbbc6';
	context.stroke();
	context.closePath();

	context.beginPath();
	context.moveTo(32, 194);
	context.lineTo(23, 188);
	context.lineWidth = 4;
	context.strokeStyle = '#9bbbc6';
	context.stroke();
	context.closePath();

	context.beginPath();
	context.moveTo(29, 180);
	context.lineTo(24, 190);
	context.lineWidth = 4;
	context.strokeStyle = '#9bbbc6';
	context.stroke();
	context.closePath();

// cell density thing
	// also do +- for time
	for (var i = 0; i < 2; i++) {
		context.beginPath();
		context.moveTo(4, 215 + i*50);
		context.lineTo(20, 215 + i*50);
		context.moveTo(28, 215 + i*50);
		context.lineTo(44, 215 + i*50);
		context.moveTo(12, 207 + i*50);
		context.lineTo(12, 223 + i*50);
		context.lineWidth = 2;
		context.strokeStyle = '#9bbbc6';
		context.stroke();
		context.closePath();
	}	

	var p = (1 - density) * 20;			//default .75
	for (var i = 0; i < p; i++) {
		context.beginPath()
		context.rect(5 + (2*i), 230, 2, 15);
		context.fillStyle = '#9bbbc6';
		context.fill();
		context.strokeStyle = '#9bbbc6';
		context.stroke();
		context.closePath();
	}
	// add box
	context.beginPath();
	context.moveTo(4, 229);
	context.lineTo(44, 229);
	//context.moveTo(28, 215);
	context.lineTo(44, 246);
	//context.moveTo(12, 229;
	context.lineTo(4, 246);
	context.lineTo(4, 229);
	context.lineWidth = 1;
	context.strokeStyle = '#9bbbc6';
	context.stroke();
	context.closePath();

	var check2 = sessionStorage.getItem("gridSet");
	if (check2 == "true") { drawGrid();	}

	// time speedometer
	context.beginPath();
	context.arc(24, 290, 12, 0.85*Math.PI, 0.15*Math.PI);
	context.lineWidth = 2;
	context.strokeStyle = '#9bbbc6';
	context.stroke();
	context.closePath();
	// indicator, default = 400 ms, 50-800 range, translate to 1.3Pi arc
	// convert interval
	var t = ((interval - 50) * (1300 / 250)) / 1000;		// 250 - (800-50)/3
	t = t - (0.15*Math.PI); // translate into angle as seen, with 0 radians = horizontal left
	var x = Math.round(10*Math.cos(t)); var y = Math.round(10*Math.sin(t));
	context.beginPath();
	context.moveTo(24, 290);
	context.lineTo(24 + x, 290 - y);		//
	context.lineWidth = 2;
	context.strokeStyle = '#9bbbc6';
	context.stroke();
	context.closePath();

	// auto-draw Gosper's Glider Gun

	context.beginPath()
	context.rect(8, 306, 1, 1);	
	context.rect(12, 304, 1, 4);
	context.rect(10, 308, 1, 1);	

	context.rect(14, 312, 1, 1);	
	context.rect(16, 314, 3, 1);
	context.rect(14, 316, 3, 1);	
	
	context.rect(22, 321, 1, 1);	
	context.rect(24, 323, 1, 1);
	context.rect(20, 325, 3, 1);

	context.rect(28, 331, 1, 1);	
	context.rect(30, 333, 1, 3);
	context.rect(32, 331, 1, 3);

	context.rect(34, 341, 1, 1);	
	context.rect(38, 339, 1, 4);
	context.rect(34, 343, 1, 1);	

	context.fillStyle = '#9bbbc6';
	context.fill();
	context.strokeStyle = '#9bbbc6';
	context.stroke();
	context.closePath();

	// 34P13 oscillator image
	context.beginPath()

	context.rect(14, 365, 3, 1);
	context.rect(20, 360, 1, 4);
	context.rect(28, 360, 1, 4);
	context.rect(34, 365, 3, 1);

	context.rect(9, 379, 3, 1);
	context.rect(14, 373, 1, 3);
	context.rect(9, 371, 3, 1);

	context.rect(20, 375, 1, 1);
	context.rect(28, 375, 1, 1);
	context.rect(24, 371, 1, 1);
	context.rect(24, 379, 1, 1);

	context.rect(36, 379, 3, 1);
	context.rect(32, 373, 1, 3);
	context.rect(36, 371, 3, 1);

	context.rect(14, 385, 3, 1);
	context.rect(20, 385, 1, 4);
	context.rect(28, 385, 1, 4);
	context.rect(34, 385, 3, 1);

	context.fillStyle = '#9bbbc6';
	context.fill();
	context.strokeStyle = '#9bbbc6';
	context.stroke();
	context.closePath();

}

function drawGrid() {
		// draw grid
for (var i = 1; i < 50; i++) {
	context.beginPath();
	context.moveTo(50, 8*i);
	context.lineTo(450, 8*i);
	context.moveTo(8*i + 50, 0);
	context.lineTo(8*i + 50, 400);
	context.lineWidth = 1;
	context.strokeStyle = '#9bbbc6';
	context.stroke();
	context.closePath();
	}	
}

function getMenuRandom(p) {

	var xVals = [37, 32, 38, 14, 5, 28, 44, 5, 39, 28, 17, 15, 10, 8, 36, 43, 33, 9, 3, 14, 44, 29, 39, 45, 28, 4, 3, 15, 38, 28, 44, 29, 14, 36, 42, 18, 19, 41, 21, 12, 23, 37, 26, 32, 43, 16, 29, 31, 24, 30];

	var yVals = [93, 72, 64, 87, 72, 90, 89, 73, 59, 82, 55, 58, 65, 68, 93, 62, 84, 66, 57, 59, 77, 78, 94, 58, 65, 92, 73, 92, 77, 95, 77, 74, 72, 89, 65, 92, 83, 59, 70, 91, 89, 74, 53, 59, 90, 94, 69, 79, 65, 74];

	return [xVals[p], yVals[p]];
}

function gliderGun() {
// set glider gun to empty array
	zeroArray(liveArray);
	var a = 502;		// reference position - +50, etc

	// left square
	liveArray[a + 250] = 1; liveArray[a + 251] = 1; liveArray[a + 300] = 1; liveArray[a + 301] = 1;
	// right square
	liveArray[a + 184] = 1; liveArray[a + 185] = 1; liveArray[a + 234] = 1; liveArray[a + 235] = 1;
	// 'c' structure, columns on successive lines
	liveArray[a + 260] = 1; liveArray[a + 310] = 1; liveArray[a + 360] = 1;
	liveArray[a + 211] = 1; liveArray[a + 411] = 1;
 	liveArray[a + 162] = 1; liveArray[a + 462] = 1;
 	liveArray[a + 163] = 1; liveArray[a + 463] = 1;
	// adjacent to 'c' structure, start with the single cell
	liveArray[a + 314] = 1;
 	liveArray[a + 215] = 1; liveArray[a + 415] = 1;
	liveArray[a + 266] = 1; liveArray[a + 316] = 1; liveArray[a + 366] = 1;
	liveArray[a + 317] = 1; 
	// middle-upper-right structure
	liveArray[a + 170] = 1; liveArray[a + 220] = 1; liveArray[a + 270] = 1;	
	liveArray[a + 171] = 1; liveArray[a + 221] = 1; liveArray[a + 271] = 1;	
	liveArray[a + 122] = 1; liveArray[a + 322] = 1;
	liveArray[a + 74] = 1; liveArray[a + 124] = 1; liveArray[a + 324] = 1; liveArray[a + 374] = 1;
}

function oscillator() {
	zeroArray(liveArray);
	var a = 358;

	// squares
	liveArray[a + 515] = 1; liveArray[a + 516] = 1; liveArray[a + 565] = 1; liveArray[a + 566] = 1;	
	liveArray[a + 1115] = 1; liveArray[a + 1116] = 1; liveArray[a + 1165] = 1; liveArray[a + 1166] = 1;
	liveArray[a + 809] = 1; liveArray[a + 810] = 1; liveArray[a + 859] = 1; liveArray[a + 860] = 1;
	liveArray[a + 821] = 1; liveArray[a + 822] = 1; liveArray[a + 871] = 1; liveArray[a + 872] = 1;
	// just each row in turn now for the top structure
	liveArray[a + 61] = 1; liveArray[a + 70] = 1;
	liveArray[a + 110] = 1; liveArray[a + 112] = 1; liveArray[a + 120] = 1;
	liveArray[a + 170] = 1; liveArray[a + 210] = 1;		//r 3, 4
	liveArray[a + 260] = 1; liveArray[a + 263] = 1; liveArray[a + 271] = 1; liveArray[a + 272] = 1;
	liveArray[a + 309] = 1; liveArray[a + 321] = 1; liveArray[a + 322] = 1;
	liveArray[a + 359] = 1; liveArray[a + 371] = 1; liveArray[a + 372] = 1; liveArray[a + 373] = 1;
	liveArray[a + 409] = 1; liveArray[a + 413] = 1; liveArray[a + 419] = 1; liveArray[a + 420] = 1; liveArray[a + 422] = 1;
	liveArray[a + 460] = 1; liveArray[a + 461] = 1; liveArray[a + 462] = 1;
	liveArray[a + 469] = 1; liveArray[a + 470] = 1; liveArray[a + 471] = 1; liveArray[a + 520] = 1;
	// top left then top right
	liveArray[a + 505] = 1; liveArray[a + 506] = 1; liveArray[a + 507] = 1;
	liveArray[a + 551] = 1; liveArray[a + 553] = 1; liveArray[a + 554] = 1; liveArray[a + 558] = 1;
	liveArray[a + 600] = 1; liveArray[a + 608] = 1; liveArray[a + 651] = 1; liveArray[a + 658] = 1; // 2 rows
	liveArray[a + 704] = 1; liveArray[a + 707] = 1; // finished
	liveArray[a + 475] = 1; 
	liveArray[a + 524] = 1; liveArray[a + 525] = 1; liveArray[a + 526] = 1; liveArray[a + 527] = 1; 
	liveArray[a + 573] = 1; liveArray[a + 575] = 1; liveArray[a + 576] = 1; liveArray[a + 577] = 1;
	liveArray[a + 622] = 1; liveArray[a + 623] = 1; liveArray[a + 624] = 1;
	liveArray[a + 629] = 1; liveArray[a + 630] = 1; liveArray[a + 631] = 1;
	liveArray[a + 673] = 1; liveArray[a + 674] = 1; // finished
	// bottom left
	liveArray[a + 1007] = 1; liveArray[a + 1008] = 1;
	liveArray[a + 1050] = 1; liveArray[a + 1051] = 1; liveArray[a + 1052] = 1; 
	liveArray[a + 1057] = 1; liveArray[a + 1058] = 1; liveArray[a + 1059] = 1;
	liveArray[a + 1104] = 1; liveArray[a + 1105] = 1; liveArray[a + 1106] = 1; liveArray[a + 1108] = 1;
	liveArray[a + 1154] = 1; liveArray[a + 1155] = 1; liveArray[a + 1156] = 1; liveArray[a + 1157] = 1; liveArray[a + 1161] = 1;
	liveArray[a + 1206] = 1; liveArray[a + 1210] = 1; liveArray[a + 1211] = 1; liveArray[a + 1212] = 1;
	liveArray[a + 1259] = 1; liveArray[a + 1261] = 1; liveArray[a + 1262] = 1;
	liveArray[a + 1308] = 1; liveArray[a + 1309] = 1; liveArray[a + 1310] = 1;
	liveArray[a + 1359] = 1; liveArray[a + 1360] = 1; liveArray[a + 1409] = 1; liveArray[a + 1410] = 1;
	liveArray[a + 1511] = 1; liveArray[a + 1561] = 1; liveArray[a + 1611] = 1;
	// bottom right
	liveArray[a + 974] = 1; liveArray[a + 977] = 1; liveArray[a + 1023] = 1; liveArray[a + 1030] = 1;
	liveArray[a + 1073] = 1; liveArray[a + 1081] = 1;
	liveArray[a + 1123] = 1; liveArray[a + 1127] = 1; liveArray[a + 1128] = 1;  liveArray[a + 1130] = 1;
	liveArray[a + 1174] = 1; liveArray[a + 1175] = 1; liveArray[a + 1176] = 1;
	liveArray[a + 1219] = 1; liveArray[a + 1220] = 1; liveArray[a + 1221] = 1;
	liveArray[a + 1268] = 1; liveArray[a + 1272] = 1; liveArray[a + 1322] = 1; liveArray[a + 1372] = 1; // 3 rows
	liveArray[a + 1418] = 1; liveArray[a + 1421] = 1; liveArray[a + 1471] = 1; // 2 rows
	liveArray[a + 1569] = 1; liveArray[a + 1571] = 1; liveArray[a + 1620] = 1; // 2 rows
}









