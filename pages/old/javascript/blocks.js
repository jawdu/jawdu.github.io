var timer; // Contains the setInterval() object, which is used to stop the animation.
var delay = 10;
var sqPos = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
var nextHolePos = 15; // where the hole will be next
var lastHolePos = 16;
var holeBaseX = 300; // initial values
var holeBaseY = 300;
var velocityDirect = [1, 0];
var currentBlock = 15;
var dsBlock = 0;
			
function speedCalc(s) {
	return (s / 500) * delay;
}

function init() {
			
	svgBlocks = document.getElementById("svgBlocks"); 

	for (var i = 0; i < 15; i++) {
		var j = i + 1;
		var sqSet = "sq" + j + " = document.getElementById(\"sq" + j + "\"); sq" + j
					+ ".vx = 0; sq" + j + ".vy = 0;";
		eval(sqSet);
		/*sq1 = document.getElementById("sq1"); sq1.vx = 0; sq1.vy = 0;		*/		
	}

	//sq15.vx = 50;
	if (Math.random() < 0.5) {sq15.vx = 50;
	} else {sq12.vy = 50; nextHolePos = 12; currentBlock = 12; velocityDirect = [0, 1]};
	
	timer = setInterval(moveBlockHandler, delay);

}

function moveBlockHandler() {
	
	moveBlock();
	      
	if (dsBlock >= 100) {
		// change bits here
		swapHolePos();
		getNextHolePos();
		changeVelocities();
		dsBlock = 0;
	}

}

function moveBlock() {
		if (velocityDirect[0] != 0) {
			var p = "sq" + currentBlock + ".x.baseVal.value += " + "speedCalc(sq" + currentBlock + ".vx);";
			var q = "dsBlock = dsBlock + Math.abs(speedCalc(sq" + currentBlock + ".vx));";
		}
		else {
			var p = "sq" + currentBlock + ".y.baseVal.value += " + "speedCalc(sq" + currentBlock + ".vy);";
			var q = "dsBlock = dsBlock + Math.abs(speedCalc(sq" + currentBlock + ".vy));";
		};
		eval(p);
		eval(q);
}

function swapHolePos() {
	var temp = sqPos[nextHolePos - 1];
	sqPos[nextHolePos - 1] = sqPos[lastHolePos - 1];
	sqPos[lastHolePos - 1] = temp;
}

function getNextHolePos() {
	var opt1 = [2, 5];
	var opt2 = [1, 3, 6];
	var opt3 = [2, 4, 7];
	var opt4 = [3, 8];
	var opt5 = [1, 6, 9];
	var opt6 = [2, 5, 7, 10];
	var opt7 = [3, 6, 8, 11];
	var opt8 = [4, 7, 12];	
	var opt9 = [5, 10, 13];
	var opt10 = [6, 9, 11, 14];
	var opt11 = [7, 10, 12, 15];
	var opt12 = [8, 11, 16];	
	var opt13 = [9, 14];
	var opt14 = [10, 13, 15];
	var opt15 = [11, 14, 16];
	var opt16 = [12, 15];

	// to select a new one:
	var q = "var p = opt" + nextHolePos + "[Math.floor((Math.random()*opt" + nextHolePos + ".length))];"; 
	eval(q);

	lastHolePos = nextHolePos;
	nextHolePos = p;

}

function changeVelocities() {

	// change holeBaseX,Y & reset old velocity
	
	if (velocityDirect[0] != 0) {
		holeBaseX -= 100 * velocityDirect[0]; // -= as go in opposite direction to block
		var p = "sq" + currentBlock + ".vx = 0;";
	}
	else {
		holeBaseY -= 100 * velocityDirect[1];
		var p = "sq" + currentBlock + " .vy = 0;";		
	};
	eval(p);

	// whichever sqXX.x.baseVal.value != holeBaseX
	// 			 sqYY.y.baseVal.value != holeBaseY is direction.

	var k = sqPos[nextHolePos-1]; // the sq number needed
	var q = "var bX = sq" + k + ".x.baseVal.value; var bY = sq" + k + ".y.baseVal.value;";
	eval(q); // bX, bY now should be nextHole x,y
	

	if (bX != holeBaseX) {
		velocityDirect[0] = -(bX - holeBaseX) / Math.abs(bX - holeBaseX); // get +- 1
		velocityDirect[1] = 0;
	} else {
		velocityDirect[0] = 0;
		velocityDirect[1] = -(bY - holeBaseY) / Math.abs(bY - holeBaseY);
	}

	currentBlock = sqPos[nextHolePos - 1];

	// now new velocity

	if (velocityDirect[0] != 0) {
		var p = "sq" + currentBlock + ".vx = velocityDirect[0]*50;";
	}
	else {
		var p = "sq" + currentBlock + ".vy = velocityDirect[1]*50;";		
	};
	eval(p);	

}





