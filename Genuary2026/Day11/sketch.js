/// Genuary 2026 -  Day 11: Quine.
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
  

}


class Cell {
  constructor() {
    this.length = random(10, 20);
    this.x = random(-this.mainRadius, this.mainRadius);
    this.y = random(-this.mainRadius, this.mainRadius);
    
  }

  reset() {

  }

  update() {

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
    saveGif(`${timestamp}-genuary-11`, 480, { units: 'frames'} );
  }
  return;
}

function windowResized() {
  init();
}

