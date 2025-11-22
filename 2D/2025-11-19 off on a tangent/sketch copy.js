let env, filter, noiseGen;
let doRenderGrid;
let center;
let w, h;
let circleSize;
let trailTime, minTrailTime, maxTrailTime;
let angleIncrement, minAngleIncrement, maxAngleIncrement;
let fps;
let noiseOctaves, noiseFalloff;
let cells;

function setup() {
  createCanvas(windowWidth, windowHeight);
  init();
}

function init() {
  cells = [];
  fps = 30;
  noiseSeed(1);
  frameRate(30);
  doRenderGrid = false;
  minTrailTime = 0;
  maxTrailTime = 25;
  trailTime = 10;
  w = windowWidth;
  h = windowHeight;
  circleSize = min(w, h) / 4;
  minAngleIncrement = 0.001;
  maxAngleIncrement = 0.05;
  angleIncrement = 0.15;
  // env = new p5.Envelope(0.2, 0.5, 1.5, 0.15);
  // filter = new p5.BandPass();
  // noiseGen = new p5.Noise();
  // noiseGen.disconnect();
  // noiseGen.connect(filter);
  cells.push(new Cell(windowWidth * 2/12, windowHeight / 2, circleSize, 3, 0.7));
  cells.push(new Cell(windowWidth * 5.5/12, windowHeight / 2, circleSize, 4, 0.7));
  cells.push(new Cell(windowWidth * 9.5/12, windowHeight / 2, circleSize, 5, 0.7));

}

function draw() {
  trailTime = sin(frameCount  / fps / 2) * maxTrailTime;
  background(10, trailTime);
  cells[0].update();
  cells[0].draw();
  

  cells[1].update();
  cells[1].draw();
  
  cells[2].update();
  cells[2].draw();
  // cells.forEach(cell => {
  //   cell.update();
  //   cell.draw();
  // });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  init();
}

function mouseMoved() {
  //trailTime = map(mouseY, windowHeight, 0, minTrailTime, maxTrailTime);
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
  constructor(xi, yi, size, noiseOctaves, noiseFalloff) {
    this.init(xi, yi, size, noiseOctaves, noiseFalloff);
  }

  init(xi, yi, size, noiseOctaves, noiseFalloff) {
    this.xi = xi;
    this.yi = yi;
    this.size = size;
    this.angle = 0;
    this.angleIncrement = angleIncrement;
    this.noiseOctaves = noiseOctaves;
    this.noiseFalloff = noiseFalloff;
    this.pointSize = 5;
    this.t = 0;
    this.xt1;
    this.yt1;
    this.xt2;
    this.yt2;
    this.mxt1;
    this.myt1;
    this.mxt2;
    this.myt2;
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
    
    noiseDetail(this.noiseOctaves, this.noiseFalloff);
    this.size = noise(this.t) * circleSize;
    this.x = this.xi + cos(this.angle) * this.size;
    this.y = this.yi + sin(this.angle) * this.size;
    this.mx = this.xi + cos(this.angle + PI) * this.size;
    this.my = this.yi + sin(this.angle + PI) * this.size;
    let tangentAngle1 = this.angle + PI / 2;
    let tangentAngle2 = this.angle - PI / 2;
    let mtangentAngle1 = this.angle + PI + PI / 2;
    let mtangentAngle2 = this.angle + PI - PI / 2;
    this.xt1 = this.x + cos(tangentAngle1) * this.size;
    this.yt1 = this.y + sin(tangentAngle1) * this.size;
    this.xt2 = this.x + cos(tangentAngle2) * this.size;
    this.yt2 = this.y + sin(tangentAngle2) * this.size;
    this.mxt1 = this.mx + cos(mtangentAngle1) * this.size;
    this.myt1 = this.my + sin(mtangentAngle1) * this.size;
    this.mxt2 = this.mx + cos(mtangentAngle2) * this.size;
    this.myt2 = this.my + sin(mtangentAngle2) * this.size;
    this.angleIncrement= sin(this.t) * maxAngleIncrement;
    this.angle += this.angleIncrement;
    this.t += 0.01;
  }


  draw() {
    //this.drawPoint();
    this.drawTangentLine();
  }

  drawTangentLine() {
    strokeWeight(0.7);
    stroke(250);
    line(this.xt1, this.yt1, this.xt2, this.yt2);
    stroke(255, 0, 0);
    line(this.mxt1, this.myt1, this.mxt2, this.myt2);
  }

  drawPoint() {
    strokeWeight(this.pointSize);
    stroke(250);
    point(this.x, this.y);

  }

}