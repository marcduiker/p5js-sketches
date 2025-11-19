let env, filter, noiseGen;
let doRenderGrid;
let center;
let w, h;
let circleSize;
let trailTime, minTrailTime, maxTrailTime;
let angleIncrement, minAngleIncrement, maxAngleIncrement;

function setup() {
  frameRate(30);
  createCanvas(windowWidth, windowHeight);
  init();
}

function init() {
  doRenderGrid = false;
  minTrailTime = 0;
  maxTrailTime = 255;
  trailTime = 40;
  w = windowWidth;
  h = windowHeight;
  circleSize = min(w, h) / 2;
  minAngleIncrement = 0.01;
  maxAngleIncrement = 0.5;
  angleIncrement = 0.15;
  // env = new p5.Envelope(0.2, 0.5, 1.5, 0.15);
  // filter = new p5.BandPass();
  // noiseGen = new p5.Noise();
  // noiseGen.disconnect();
  // noiseGen.connect(filter);
  center = new Cell(windowWidth / 2, windowHeight / 2, circleSize);
  
}

function draw() {
  background(10, trailTime);
  center.update();
  center.draw();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  init();
}

function mouseMoved() {
  trailTime = map(mouseY, windowHeight, 0, minTrailTime, maxTrailTime);
  //angleIncrement = map(mouseX, 0, windowWidth, minAngleIncrement, maxAngleIncrement);
}

function keyPressed() {
  // if (key === 'r' || key === 'R') {
  //   doRenderGrid = !doRenderGrid;
  // }

  // if (doRenderGrid) {
  //     init();
  //     noiseGen.start();
  // } else {
  //     noiseGen.stop();
  // }
}

class Cell {
  constructor(xi, yi, size) {
    this.init(xi, yi, size);
  }

  init(xi, yi, size) {
    this.xi = xi;
    this.yi = yi;
    this.size = size;
    this.angle = 0;
    this.angleIncrement = angleIncrement;
    this.pointSize = 5;
    this.t = 0;
    this.xt1;
    this.yt1;
    this.xt2;
    this.yt2;
  }

  reset() {
    
  }

  playSound() {
    filter.freq(random(200, 1000));
    noiseGen.pan(sin(this.t/30));
    filter.res(random(5, 50));
    env.play(noiseGen);
  }

  update() {
    this.size = noise(this.t) * circleSize;
    this.angleIncrement = angleIncrement;
    this.x = this.xi + cos(this.angle) * this.size;
    this.y = this.yi + sin(this.angle) * this.size;
    // A tangent line needs to be drawn at a 90 degree angle to the radius
    // The x and y of the tangent point is already calulated above.
    // Now we need two extra points to draw the tangent line.
    // let's substract 30 degrees (PI/6) and add 30 degrees (PI/6) to the angle to get two points on the tangent line.
    let tangentAngle1 = this.angle + PI / 2;
    let tangentAngle2 = this.angle - PI / 2;
    this.xt1 = this.x + cos(tangentAngle1) * this.size;
    this.yt1 = this.y + sin(tangentAngle1) * this.size;
    this.xt2 = this.x + cos(tangentAngle2) * this.size;
    this.yt2 = this.y + sin(tangentAngle2) * this.size;
    this.angleIncrement= sin(this.t) * maxAngleIncrement / 10;
    this.angle += this.angleIncrement;
    this.t += 0.01;
  }


  draw() {
    //this.drawPoint();
    this.drawTangentLine();
  }

  drawTangentLine() {
    strokeWeight(1);
    stroke(250);
    line(this.xt1, this.yt1, this.xt2, this.yt2);
  }

  drawPoint() {
    strokeWeight(this.pointSize);
    stroke(250);
    point(this.x, this.y);

  }

}