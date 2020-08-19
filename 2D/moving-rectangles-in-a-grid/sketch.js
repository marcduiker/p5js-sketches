// Resizing Colored Boxes in a Grid
// Marc Duiker, 2020

let colorArray = ["#d2f1e4", "#fbcaef", "#f865b0", "#e637bf", "#48304d", "#e637bf", "#f865b0", "#fbcaef"]

let gridSize = 9; // Change the grid size (4, 9, 16, 25, 36, 49)
let gridSizeLen = Math.sqrt(gridSize);
let noiseXOffset = 0.002; // Increase for higher noise variations
let gridArray = [];
let baseHeight;
let maxWidth;
let maxHeight;
let nrOfRows;

function setup() {
  frameRate(30);
  createCanvas(600, 600);
  
  maxWidth = 600 / gridSizeLen;
  maxHeight = 600 / gridSizeLen;
  baseHeight = maxHeight / colorArray.length;
  nrOfRows =  Math.ceil(maxHeight/baseHeight);
  for (let i = 0; i < gridSize; i++) {
    let boxArray = [];
    let noiseArray = [];
    for (let r = 0; r < nrOfRows; r++) {
      let color1 = colorArray[r % colorArray.length];
      let color2 = colorArray[(r+1) % colorArray.length];
      
      // Try this for random colors in the palette:
      //let color1 = colorArray[Math.floor(random(0,colorArray.length))];
      //let color2 = colorArray[Math.floor(random(0,colorArray.length))];
      
      boxArray.push(new Box(i, r, maxWidth, color1, color2));
      noiseArray.push(random(-1, 1));
    }
    gridArray.push([i, boxArray, noiseArray]);
  }
}

function draw() {
  background(220);
  for (let i = 0; i < gridSize; i++) {
    let boxArray = gridArray[i][1];
    let noiseArray = gridArray[i][2];
    for (let r = 0; r < nrOfRows; r++) {
      let mappedOffset = map(i, 0, gridSize-1, 1, 20);
      noiseArray[r] = noiseArray[r] + noiseXOffset * mappedOffset; 
      boxArray[r].setXYW(noiseArray[r]);
      boxArray[r].draw();
    }
  }
}

class Box {
    constructor(i, row, maxWidth, color1, color2) {
      this.i = i;
      this.row = row;
      this.column = i % gridSizeLen;
      this.x = this.column * maxWidth;
      this.y = (Math.floor(i/gridSizeLen) * maxHeight) + row * baseHeight;
      this.w1 = maxWidth;
      this.w2 = maxWidth;
      this.h = baseHeight;
      this.wmax = maxWidth;
      this.color1 = color1;
      this.color2 = color2;
    }

    setXYW(noiseX) {
      let boxWidth = noise(noiseX) * maxWidth;
      this.w1 = boxWidth;
      this.w2 = this.wmax - this.w1;
    }

    draw() {
      noStroke();
      fill(this.color1);
      rect(this.x, this.y, this.w1, this.h);
      fill(this.color2);
      rect(this.column * this.wmax + this.w1, this.y, this.w2, this.h);
    }
}
