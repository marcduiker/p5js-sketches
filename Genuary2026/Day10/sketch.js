/// Genuary 2026 - Day 10: Polar coordinates.
/// Marc Duiker
/// https://marcduiker.dev
/// Jan 2026

let colors = dreamhaze8;
const fps = 24;
let bgColor, fgColor;
let windowW, windowH;
let mainDiameter;
const isDebug = false;
let angle;
let noiseDelta = 0.01;

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
  angle = 0;
}

function draw() {
  //background(bgColor);
  background(applyAlphaToColor(bgColor, 15));
  
  push();
  translate(windowW / 2, windowH / 2);
  for (let i = 1; i < 4; i++) {
    let radius = noise(frameCount/100 * i) * mainDiameter/1.3 + 25;
    let smallR = map(radius, 50, mainDiameter, 2, 25);
    angle += i/500;
    let polarCoords = convertToXY(radius, angle);
    stroke(colors[i+1]);
    strokeWeight(1);
    line(0, 0, polarCoords.x, polarCoords.y);
    line(0, 0, -polarCoords.x, -polarCoords.y);
    fill(colors[i+1]);
    circle(polarCoords.x, polarCoords.y, smallR);
    circle(-polarCoords.x, -polarCoords.y, smallR);
    noFill();
    circle(0, 0, mainDiameter/i);
  }

  pop();
  angle += 0.005;
}

function convertToXY(radius, angle) {
  let x = radius * cos(angle);
  let y = radius * sin(angle);
  return {x: x, y: y};
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
    saveGif(`${timestamp}-genuary-10`, 480, { units: 'frames'} );
  }
  return;
}

function windowResized() {
  init();
}

