/// Genuary 2026 - Day 2: Twelve principles of animation
/// Marc Duiker
/// https://marcduiker.dev
/// Jan 2026

let word;
let colors = blackwhite;
let maxFontSize;
const fps = 30;
let bgColor;
let windowW, windowH;
let animObject;

async function setup() {
  frameRate(fps);
  init();
}

function init() {
  windowW = 800;
  windowH = 800;
  createCanvas(windowW, windowH);
  bgColor = colors[0];
  animObject = new AnimObject(windowW / 2);
}

function draw() {
  background(bgColor);
  animObject.update();
  animObject.draw();
}

function keyPressed() {
  console.log('key pressed', key);
  if (key === 's') {
    let timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    saveGif(`${timestamp}-genuary-3`, 240, { units: 'frames' } );
  }
  return;
}

class AnimObject {
  constructor(size) {
    this.init(size);
  }

  init(size) {
    this.radiusX = size;
    this.radiusY = size;
    this.maxRadiusY = size;
    this.minRadiusY = size / 2;
    this.origY = windowH / 2;
    this.y = this.origY;
    this.x = windowW / 2;
    this.color = colors[1];
    this.starCount = 50;
    this.maxStarLength = size / 4;
    this.stars = [];
    for (let i = 0; i < this.starCount; i++) {
      this.stars.push(new Star(this.maxStarLength));
    }
  }
  
  update() {
    let period = PI/8 * frameCount * 1/fps;
    this.y = this.origY + sin(period) * random(-5, 5);
    this.radiusY = abs(cos(period) * this.maxRadiusY);
    if (this.radiusY < this.minRadiusY) {
      this.radiusY = this.minRadiusY;
    }
    this.stars.forEach(star => {
      let length = abs(sin(period)) * star.maxStarLength;
      let deltaX = map(star.length, 0, this.maxStarLength, 0, 20);
      let x = star.x - deltaX;
      let y = star.origY;
      star.update(length, x, y);
    });
  }
  
  draw() {
    // background
    stroke(this.color);
    this.stars.forEach(star => {
      star.draw();
    });

    // ball
    fill(this.color);
    noStroke();
    ellipse(this.x, this.y, this.radiusX, this.radiusY);

    noFill();
    stroke(this.applyAlphaToColor(colors[1], map(this.radiusY, this.minRadiusY, this.maxRadiusY, 200, 0)));
    strokeWeight(1);
    ellipse(this.x, this.y, this.radiusX + 5, this.radiusY + 5);
    ellipse(this.x, this.y, this.radiusX + 10, this.radiusY + 10);
  }

  applyAlphaToColor(col, alpha) {
    let c = color(col);
    return color(red(c), green(c), blue(c), alpha);
  }
}

class Star {
  constructor(maxStarLength) {
    this.origMaxStarLength = maxStarLength;
    this.maxStarLength = random(maxStarLength / 8, maxStarLength);
    this.init(this.maxStarLength);
    this.length = 0;
  }

  init(leftBoundary) {
    this.x = random(leftBoundary, windowW);
    this.origY = random(0, windowH);
    this.y = this.origY;
  }

  update(length, x, y) {
    this.length = length;
    this.x = x;
    this.y = y;
    if (this.x + this.length < 0) {
      this.init(windowW + this.length);
    }
  }

  draw() {
    stroke(colors[1]);
    strokeWeight(map(this.maxStarLength, this.origMaxStarLength / 8, this.origMaxStarLength, 0.5, 3));
    line(this.x, this.y, this.x + this.length, this.y);
  }
}

function windowResized() {
  init();
}

