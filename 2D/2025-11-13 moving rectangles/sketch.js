let cells;
const gridSize = 10;
const gridWidth = 600;
const gridHeight = gridWidth;
let borderH;
let borderW;
const cellPadding = gridWidth / 20;
let cellSize;

function setup() {
  createCanvas(windowWidth, windowHeight);
  init();
}

function init() {
  cells = [];
  borderW = (windowWidth - gridWidth) / 2;
  borderH = (windowHeight - gridHeight) / 2;
  cellSize = (gridWidth - (gridSize - 1) * cellPadding) / gridSize;
  for (let xi = 0; xi < gridSize; xi++) {
    for (let yi = 0; yi < gridSize; yi++) {
      cells.push(new Cell(xi, yi, cellSize));
    }
  }
}

function draw() {
  background(0);
  cells.forEach(cell => {
    cell.update();
    cell.draw();
  });
}


class Cell {
  constructor(xi, yi, size) {
    this.init(xi, yi, size);
  }

  minSpeed = 0.1;
  maxSpeed = 1;
  minStroke = 0.5;
  maxStroke = 2.5;

  init(xi, yi, size) {
    this.xi = xi;
    this.yi = yi;
    this.xCenter = borderW + xi * (cellPadding + size) + size / 2;
    this.yCenter = borderH + yi * (cellPadding + size) + size / 2;
    this.x0 = borderW + xi * (cellPadding + size);
    this.y0 = borderH + yi * (cellPadding + size);
    this.size = size;
    this.xStart = map(random(0, 1), 0, 1, this.x0, this.x0 + this.size);
    this.setSpeed();
    this.fillColor = this.speed > 0 ? color(255) : color(255, 0, 0);
    this.x1 = this.xStart;
    this.y1 = this.y0;
    this.x2 = this.x1;
    this.y2 = this.y0 + this.size;
    this.dynSize = this.size;
  }

  setSpeed() {
    this.speed = random(this.minSpeed, this.maxSpeed);
    this.speed = this.speed * random([-1, 1]);
    this.fillColor = this.speed > 0 ? color(255) : color(255, 0, 0);
  }

  reset() {
    this.setSpeed();
    if (this.speed > 0) {
      this.x1 = this.x0;
    } else {
      this.x1 = this.x0 + this.size;
    }
  }

  update() {
    if (this.x1 < (this.x0 + this.size) && this.speed > 0) {
      this.x1 += this.speed;
    } else if (this.x1 > this.x0 && this.speed < 0) {
      this.x1 += this.speed;
    } else {
      this.reset();
    }
    this.x2 = this.x1;
    this.dynSize = this.speed > 0 ? this.x1 - this.x0 : this.x0 + this.size - this.x1;
  }


  draw() {
    //this.drawBorder();
    //this.drawLine();
    this.drawBox();
  }

  drawPoint() {
    push();
    translate(this.xCenter, this.yCenter);
    stroke(255);
    strokeWeight(5);
    point(0, 0);
    pop();
  }

  drawLine() {
    stroke(255);
    strokeWeight(1);
    line(this.x1, this.y1, this.x2, this.y2);
  }

  drawBox() {
    noStroke();
    fill(this.fillColor);
    if (this.speed > 0) {

      rect(this.x0, this.y0, this.dynSize, this.size);
    } else {
      rect(this.x1, this.y1, this.dynSize, this.size);
    }
  }

  drawBorder() {
    stroke(255);
    strokeWeight(0.5);
    noFill();
    square(this.x0, this.y0, this.size);
  }

}