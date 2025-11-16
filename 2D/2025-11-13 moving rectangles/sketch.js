let cells;
const gridSize = 10;
let gridWidth, gridHeight;
let borderH, borderW;
let cellPadding;
let cellSize;
let tDelta = 0.001;
let t;
let noiseScaleX = 1;
let noiseScaleY = 1;
let noiseThreshold = 0.3;
let env;
let filter, noiseGen;
let minSpeed, maxSpeed;

function setup() {
  setFrameRate(30);
  createCanvas(windowWidth, windowHeight);
  init();
}

function init() {
  noiseDetail(3, 0.5);
  minSpeed = 0.1;
  maxSpeed = 1;
  env = new p5.Envelope(0.2, 0.3, 1.5, 0.15);
  filter = new p5.BandPass();
  noiseGen = new p5.Noise();
  noiseGen.disconnect();
  noiseGen.connect(filter);
  noiseGen.start();
  cells = [];
  if (windowWidth < windowHeight) {
    gridWidth = windowWidth * 0.75;
    gridHeight = gridWidth;
  } else {
    gridHeight = windowHeight * 0.75;
    gridWidth = gridHeight;
  }
  cellPadding = gridWidth / 40;
  borderW = (windowWidth - gridWidth) / 2;
  borderH = (windowHeight - gridHeight) / 2;
  cellSize = (gridWidth - (gridSize - 1) * cellPadding) / gridSize;
  t = 0;
  for (let xi = 0; xi < gridSize; xi++) {
    for (let yi = 0; yi < gridSize; yi++) {
      cells.push(new Cell(xi, yi, cellSize));
    }
  }
}

function draw() {
  background(10);
  cells.forEach(cell => {
    cell.update();
    cell.draw();
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  init();
}

function mouseMoved() {
  noiseThreshold = map(mouseX, 0, windowWidth, 0.1, 0.9);
  maxSpeed = map(mouseY, 0, windowHeight, 5, 0.1);
}

class Cell {
  constructor(xi, yi, size) {
    this.init(xi, yi, size);
  }

  minStroke = 1;
  maxStroke = 5;

  init(xi, yi, size) {
    this.xi = xi;
    this.yi = yi;
    this.xCenter = borderW + xi * (cellPadding + size) + size / 2;
    this.yCenter = borderH + yi * (cellPadding + size) + size / 2;
    this.x0 = borderW + xi * (cellPadding + size);
    this.y0 = borderH + yi * (cellPadding + size);
    this.size = size;
    this.xStart = this.setXPosNoise();
    this.setSpeedNoise();
    this.x1 = this.xStart;
    this.y1 = this.y0;
    this.x2 = this.x1;
    this.y2 = this.y0 + this.size;
    this.dynSize = this.size;
    this.strokeWeight = 1;
  }

  setXPosNoise() {
    this.xStart = map(this.getNoise2D(), 0, 1, this.x0, this.x0 + this.size);
  }

  getNoise1D() {
    return noise(t);
  }

  getNoise2D() {
    return noise(this.x0, t);
  }
  
  getNoise3D() {
    return noise(this.x0 * noiseScaleX, this.y0 * noiseScaleY, t);
  }

  setXPosRandom() {
    this.xStart = map(random(0, 1), 0, 1, this.x0, this.x0 + this.size);
  }

  setSpeedRandom() {
    this.speed = random(minSpeed, maxSpeed);
    this.speed = this.speed * random([-1, 1]);
    this.fillColor = this.speed > 0 ? color(255) : color(255, 0, 0);
  }

  setSpeedNoise() {
    let noiseVal = this.getNoise1D();
    this.speed = map(noiseVal, 0, 1, minSpeed, maxSpeed);
    this.speed = this.speed * (noiseVal < noiseThreshold ? -1 : 1);
    this.fillColor = this.speed > 0 ? color(255) : color(255, 0, 0);
  }

  reset() {
    this.setSpeedNoise();
    if (this.speed > 0) {
      filter.freq(random(2000, 6000));
      noiseGen.pan(-sin(t/30));
      this.x1 = this.x0;
    } else {
      filter.freq(random(200, 1000));
      noiseGen.pan(sin(t/30));
      this.x1 = this.x0 + this.size;
    }
    filter.res(random(5, 50));
    env.play(noiseGen);
  }

  update() {
    t += tDelta;
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
    //this.drawPoint();
  }

  drawPoint() {
    push();
    translate(this.xCenter, this.yCenter);
    stroke(255);
    strokeWeight(2);
    point(0, 0);
    pop();
  }

  drawLine() {
    stroke(255);
    strokeWeight(1);
    line(this.x1, this.y1, this.x2, this.y2);
  }

  drawBox() {
    //noStroke();
    strokeWeight(0.5);
    stroke(this.fillColor);
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