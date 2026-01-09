/// Genuary 2026 - Day 7: Boolean algebra. Get inspired by Boolean algebra, in any way.
/// Marc Duiker
/// https://marcduiker.dev
/// Jan 2026

let colors = blackwhite;
const fps = 24;
let bgColor, fgColor;
let windowW, windowH;
let cells = [];
const nrOfCells = 150;
let mainDiameter;
const isDebug = false;

async function setup() {
  frameRate(fps);
  init();
}

function init() {
  windowW = windowWidth;
  windowH = windowHeight;
  createCanvas(windowW, windowH);
  bgColor = colors[0];
  fgColor = colors[1];
  mainDiameter = windowW / 1.5;
  for (let i = 0; i < nrOfCells; i++) {
    cells.push(new Cell(mainDiameter));
  }
}

function draw() {
  background(bgColor);
  //background(applyAlphaToColor(bgColor, 25));
  
  push();
  translate(windowW / 2, windowH / 2);
  if (!isDebug) beginClip({ invert: true });
  cells.forEach(cell => {
    cell.update();
    cell.draw();
  });
  
  if (!isDebug) {
    endClip();
    fill(fgColor);
  } else {
    noFill();
    stroke(fgColor);
  }
  circle(0, 0, mainDiameter);
  pop();
}

class Cell {
  constructor(mainDiameter) {
    this.mainDiameter = mainDiameter;
    this.mainRadius = mainDiameter / 2;
    this.x = random(-this.mainRadius, this.mainRadius);
    this.y = random(-this.mainRadius, this.mainRadius);
    let dfromCenter = dist(0, 0, this.x, this.y);
    this.minRadius = 1;
    this.maxRadius = 120;
    this.r = map(dfromCenter, 0, this.mainRadius, this.maxRadius, this.minRadius);
  }

  reset() {
    // calculate the x and y values for a point on a circle to the left of the center with radius mainRadius:
    let angle = random(-PI/2, PI/2);
    this.x = cos(angle) * (-this.mainRadius - this.r);
    this.y = sin(angle) * (this.mainRadius);
  }

  update() {
    let deltaX = map(this.r, this.minRadius, this.maxRadius, 1, 3);
    this.x += deltaX;
    let dfromCenter = dist(0, 0, this.x, this.y);
    this.r = map(dfromCenter, 0, this.mainRadius, this.maxRadius, this.minRadius);
    if (dfromCenter > this.mainRadius + this.r) {
      this.reset();
    }
    let wiggleSize = map(this.r, this.minRadius, this.maxRadius, 0.5, 5);
    this.x = this.x + random(-wiggleSize, wiggleSize);
    this.y = this.y + random(-wiggleSize, wiggleSize);
  }

  draw() {
    noFill();
    stroke(fgColor);
    circle(this.x, this.y, this.r);
  }
}

function applyAlphaToColor(col, alpha) {
    let c = color(col);
    return color(red(c), green(c), blue(c), alpha);
}

function keyPressed() {
  console.log('key pressed', key);
  if (key === 's') {
    let timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    saveGif(`${timestamp}-genuary-7`, 480, { units: 'frames'} );
  }
  return;
}

function windowResized() {
  init();
}

