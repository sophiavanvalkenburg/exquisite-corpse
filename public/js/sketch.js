var OUTER_SIDE_LENGTH = 500;
var MARGIN = 50;
var INNER_SIDE_LENGTH = OUTER_SIDE_LENGTH - MARGIN * 2;
var BRUSH_WIDTH = 20;
var SAVE_KEY = 83;
var LOAD_KEY = 76;

var jsonData = {
  name: "test",
  location: {
    x: 0,
    y: 0
  },
  image: {
    topMargin: [],
    bottomMargin: [],
    leftMargin: [],
    rightMargin: [], 
    center: []
  }
};

function setup(){
  var theCanvas = createCanvas(OUTER_SIDE_LENGTH, OUTER_SIDE_LENGTH);
  theCanvas.parent('canvas-container');
  setupCanvas();
}

function setupCanvas(){
  background(255);
  strokeWeight(3);
  stroke(255, 0, 0);
  fill(255);
  rect(MARGIN, MARGIN, INNER_SIDE_LENGTH, INNER_SIDE_LENGTH);
  strokeWeight(0);
  fill(0);
}

function drawStroke(x, y){
  ellipse(x, y, BRUSH_WIDTH);
}

function mouseDragged(){
  drawStroke(mouseX, mouseY); 
  var pos = [mouseX, mouseY];
  if (mouseX < MARGIN){
    jsonData.image.leftMargin.push(pos);
  } else if (mouseX > MARGIN + INNER_SIDE_LENGTH){
    jsonData.image.rightMargin.push(pos);
  } else if (mouseY < MARGIN){
    jsonData.image.topMargin.push(pos);
  } else if (mouseY > MARGIN + INNER_SIDE_LENGTH){
    jsonData.image.bottomMargin.push(pos);
  } else {
    jsonData.image.center.push(pos);
  }
}

function keyReleased(){
  if (keyCode === SAVE_KEY){
    saveSquare();
  } else if (keyCode === LOAD_KEY){
    loadJSONTest();
  }
}

function loadJSONTest(){
  setupCanvas();
  var areas = ["center", "rightMargin", "leftMargin", "bottomMargin", "topMargin"];
  for ( var a = 0, alen = areas.length; a < alen; a++){
    var area = areas[a];
    for (var i = 0, len = testLoadJSON.image[area].length; i < len; i++){
      var pos = testLoadJSON[area][i]
      drawStroke(pos[0], pos[1]); 
    }
  }
}

document.getElementById('saveSquareButton').addEventListener('click', 
  function (e){
    var http = new XMLHttpRequest();
    http.open("PUT", "/save", true);
    http.setRequestHeader("Content-type", "application/json; charset=utf-8");
    var params = JSON.stringify(jsonData);
    http.send(params);
    http.onload = function(){
      console.log(http.responseText);
    }

  }
);