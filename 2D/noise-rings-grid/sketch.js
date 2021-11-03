// Rings
// Marc Duiker, 2020


let gridSize = 3;
let itemsInGrid = gridSize * gridSize;
let grid = [];
let maxSize = 600 / gridSize;

function setup() {
  createCanvas(600, 600);
  for (i = 0; i < itemsInGrid.length; i++) {
    grid.push(new Ring(i)); 
  }
}

function draw() {
  background(220);
  for (i = 0; i < itemsInGrid.length; i++) {
    grid[i].draw();
  }
}

class Ring {
  constructor(i) {
    this.x = (i % gridSize) + (maxSize / 2);
    this.y = Math.floor(i/gridSize) + (maxSize/2);
    this.w = 100;
    this.h = 100;
    print(this.x);
  }
  
  set() {
  }
  
  draw() {
    stroke(5);
    ellipse(this.x, this.y, this.w, this.h);
  }
}