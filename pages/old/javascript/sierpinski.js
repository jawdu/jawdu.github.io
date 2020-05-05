var coords = [0, 0];
var numPoints = 10000; // WhateverItIsFromHTML;
var canvasSize = 400; // WhateverItIsFromHTML;


function startSPT() {
	var cnvs = document.getElementById("spTriangle");
	var cnvs2 = cnvs.getContext("2d");
	var i = 0;
	cnvs2.fillStyle="#FF0000";
	cnvs2.clearRect(0, 0, canvasSize, canvasSize);

	handleSPT(i, cnvs2);
}

function handleSPT(i, cnvs2){

	transform(coords);
	plotPoint(coords, canvasSize, cnvs2);

	var timer = setTimeout(function(){handleSPT(i, cnvs2);}, 5);
	i++;
	if (i == numPoints) {clearTimeout(timer);}
}


function transform(coords) {
	/* take in current (x,y) and make a random transformation */

	var randVal = Math.floor(Math.random() * 3);

	if (randVal == 2) {
		coords[0] = 0.5 * coords[0];
		coords[1] = 0.5 * coords[1];
	} else if (randVal == 1) {
		coords[0] = (0.5 * coords[0]) + 0.25;
		coords[1] = (0.5 * coords[1]) + 0.5;
	} else {
		coords[0] = (0.5 * coords[0]) + 0.5;
		coords[1] = 0.5 * coords[1];
	}
	return coords; /* [coords[1], coords[2]] ?*/
}

function plotPoint(coords, canvasSize, cnvs2) {
	var x = Math.floor(coords[0]*canvasSize);
	var y = canvasSize - (Math.floor(coords[1]*canvasSize)); // flip image
	cnvs2.fillRect(x,y,2,2);
}










