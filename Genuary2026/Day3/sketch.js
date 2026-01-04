/// Genuary 2026 - Day 3: Fibonacci forever
/// Marc Duiker
/// https://marcduiker.dev
/// Jan 2026

let word;
let colors = dreamhaze8;
const fps = 30;
let bgColor;
let windowW, windowH;
const sizes = [21, 13, 8, 5, 3, 2, 1];
const minSizeFactor = 4;
const maxSizeFactor = 7;
let sizeFactor = 5;
let armCount = 48;
let arms;


async function setup() {
  frameRate(fps);
  init();
}

function init() {
  windowW = 800;
  windowH = 800;
  createCanvas(windowW, windowH);
  bgColor = colors[0];
  arms = [];
  for (let i = 0; i < armCount; i++) {
    arms.push(new Arm(0, 0, 0, HALF_PI/8));
  }
}

function draw() {
  background(applyAlphaToColor(bgColor, 20));

  // calculate the  xy positions of points on a circle with radius 50. 
  // The number of points is determined by armCount
  push();
  translate(windowW / 2, windowH / 2);
  rotate(frameCount * 0.005);
  let angleStep = TWO_PI / armCount;
  for (let i = 0; i < armCount; i++) {
    push();
    //translate(windowW / 2, windowH / 2);
    rotate(i * angleStep);
    arms[i].update();
    arms[i].draw();
    pop();
  }
  pop();
}

function keyPressed() {
  console.log('key pressed', key);
  if (key === 's') {
    let timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    saveGif(`${timestamp}-genuary-3`, 510, { units: 'frames', delay: 60 } );
  }
  return;
}


class Arm {
  constructor(i, x, y, angle) {
    this.init(i, x, y, angle);
  }

  init(i, x, y, angle) {
    this.index = i;
    this.origX = x;
    this.origY = y;
    this.sizeFactor = sizeFactor;
    this.origAngle = angle;
    this.length = sizes[this.index];
    this.color = colors[this.index + 1];
    this.angle = i * angle;
    this.x1 = this.origX + cos(this.angle);
    this.y1 = this.origY + sin(this.angle);
    this.x2 = this.origX + cos(this.angle) * sizes[this.index] * this.sizeFactor;
    this.y2 = this.origY + sin(this.angle) * sizes[this.index] * this.sizeFactor;
    if (this.index < sizes.length - 1) {
      let newIndex = this.index+1;
      this.armObj = new Arm(newIndex, this.x2, this.y2, this.origAngle);
    }
  }

  update() {
    this.angle = sin(frameCount * 0.02) * PI/8;
    sizeFactor = map(sin(frameCount * 0.015), -1, 1, minSizeFactor, maxSizeFactor);
    this.init(this.index, this.origX, this.origY, this.angle);
    if (this.armObj) {
      this.armObj.update();
    }
  }

  draw() {
    stroke(this.color);
    strokeWeight(2);
    line(this.x1, this.y1, this.x2, this.y2);
    if (this.armObj) {
      this.armObj.draw(); 
    }
  }
}

function applyAlphaToColor(col, alpha) {
    let c = color(col);
    return color(red(c), green(c), blue(c), alpha);
  }

function windowResized() {
  init();
}

