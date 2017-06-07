var MARGIN = 50;
var BRUSH_WIDTH = 20;

function setup(){
  var theCanvas = createCanvas(500, 500);
  theCanvas.parent('canvas-container');
  background(255);
  strokeWeight(3);
  stroke(255, 0, 0);
  rect(MARGIN, MARGIN, width-MARGIN*2, height-MARGIN*2);
}

function draw(){
  fill(0);
  strokeWeight(0);
}

function mouseDragged(){
  ellipse(mouseX, mouseY, BRUSH_WIDTH, BRUSH_WIDTH); 
}
