/// Genuary 2026 - Day 8: A City. Create a generative metropolis.
/// Marc Duiker
/// https://marcduiker.dev
/// Jan 2026

let colors = blackwhite;
const fps = 24;
let bgColor, fgColor;
let windowW, windowH;
let buildings = [];
let orderedBuildings = [];
const nrOfBuildings = 50;
let minHeight, maxHeight;
let minWidth, maxWidth;

async function setup() {
  frameRate(fps);
  init();
}

function init() {
  windowW = windowWidth;
  windowH = windowHeight;
  minWidth = windowW / 25;
  maxWidth = windowW / 10;
  minHeight = windowH / 10;
  maxHeight = windowH / 1.1;
  createCanvas(windowW, windowH);
  bgColor = colors[0];
  fgColor = colors[1];
  for (let i = 0; i < nrOfBuildings; i++) {
    buildings.push(new Building());
  }
  orderedBuildings = buildings.slice().sort((a, b) => b.z - a.z);
}

function draw() {
  //background(bgColor);
  fillBackground();
  orderedBuildings.forEach(building => {
    building.update();
    building.draw();
  });
}

class Building {
  constructor() {
    this.z = random(0, 1);
    this.w = map(this.z * random(0.7, 0.95), 1, 0, minWidth, maxWidth);
    this.h = map(this.z * random(0.7, 0.99), 0, 1, minHeight, maxHeight);
    this.y = (windowH - this.h);
    this.x = random(0, windowW - this.w);
  }

  reset() {
    this.w = map(this.z * random(0.7, 0.95), 1, 0, minWidth, maxWidth);
    this.h = map(this.z * random(0.7, 0.99), 0, 1, minHeight, maxHeight);
    this.y = (windowH - this.h);
    this.x = 0 - this.w;
  }

  update() {
    let deltaX = map(this.z, 0, 1, 5, 0.5);
    this.x += deltaX;
    if (this.x > windowW) {
      this.reset();
    }
  }

  draw() {
    this.fillRect();
  }

  fillRect() {
    let alpha = map(this.z, 1, 0, 10, 255);
    let border = map(this.z, 1, 0, 10, 230);
    const topColor = color(255, 255, 255);
    const bottomColor = color(alpha, alpha, alpha);
    let modDivisor = map(this.z, 1, 0, 80, 20);

    let lineColor;
    for(let y = this.y; y < this.y + this.h; y++) {
      lineColor = lerpColor(topColor, bottomColor, y / (this.y + this.h));
      stroke(lineColor);
      line(this.x, y, this.x + this.w, y);
    }
  }
}

function fillBackground() {
    const topColor = color(20, 20, 20);
    const bottomColor = color(100, 100, 100);

    for(let y = 0; y < windowH; y++) {
      const lineColor = lerpColor(topColor, bottomColor, y / windowH);
      stroke(lineColor);
      line(0, y, windowW, y);
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
    saveGif(`${timestamp}-genuary-8`, 360, { units: 'frames'} );
  }
  return;
}

function windowResized() {
  init();
}

