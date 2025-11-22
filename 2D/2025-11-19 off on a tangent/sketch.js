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
let cellIndices;
let cellIndicesCollection = [
  [0, 0, 0, 0],
  [1, 0, 1, 0],
  [1, 1, 1, 1],
  [0, 1, 0, 1],
];
let cellIndex;
let cellA, cellB, cellC, cellD;

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
  circleSize = min(w, h) / 2;
  minAngleIncrement = 0.0005;
  maxAngleIncrement = 0.02;
  angleIncrement = 0.15;
  // env = new p5.Envelope(0.2, 0.5, 1.5, 0.15);
  // filter = new p5.BandPass();
  // noiseGen = new p5.Noise();
  // noiseGen.disconnect();
  // noiseGen.connect(filter);
  cells.push(new Cell(windowWidth / 2, windowHeight / 2, circleSize, 2, 0.7));
  cells.push(new Cell(windowWidth / 2, windowHeight / 2, circleSize, 5, 0.7));
  cellIndices = cellIndicesCollection[0];
  cellIndex = 0;
  cellA = cellIndices[0];
  cellB = cellIndices[1];
  cellC = cellIndices[2];
  cellD = cellIndices[3];
}

function updateCellIndices() {
  cellIndex = (cellIndex + 1) % cellIndices.length;
  cellIndices = cellIndicesCollection[cellIndex];
  cellA = cellIndices[0];
  cellB = cellIndices[1];
  cellC = cellIndices[2];
  cellD = cellIndices[3];
}

function draw() {
  trailTime = sin(frameCount / fps / 2) * maxTrailTime;
  background(10, trailTime);
  cells.forEach(cell => {
    cell.update();
  });

  doSwitch = floor(frameCount % (fps * random([4, 8, 16]))) === 0;
  if (doSwitch) {
    updateCellIndices();
    console.log(`Switched to cells: ${cellA}, ${cellB}, ${cellC}, ${cellD}`);
  }

  // Move the entire sketch in a push/pop to be rotated around the center
  push();
  translate(windowWidth / 2, windowHeight / 2);
  //rotate(sin(frameCount) / fps / 20);

  // top left
  push();
  beginClip();
  translate(-windowWidth / 2, -windowHeight / 2);
  rect(0, 0, windowWidth / 2, windowHeight / 2);
  endClip();
  cells[cellA].draw();
  pop();

  // top right
  push();
  beginClip();
  translate(-windowWidth / 2, -windowHeight / 2);
  rect(windowWidth / 2, 0, windowWidth / 2, windowHeight / 2);
  endClip();
  cells[cellB].draw();
  pop();

  // bottom right
  push();
  beginClip();
  translate(-windowWidth / 2, -windowHeight / 2);
  rect(windowWidth / 2, windowHeight / 2, windowWidth / 2, windowHeight / 2);
  endClip();
  cells[cellC].draw();
  pop();

   // bottom left
  push();
  beginClip();
  translate(-windowWidth / 2, -windowHeight / 2);
  rect(0, windowHeight / 2, windowWidth / 2, windowHeight / 2);
  endClip();
  cells[cellD].draw();
  pop();

  // Get out of the main translate/rotate
  pop();
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
  constructor(xi, yi, size, noiseOctaves, noiseFalloff, positionIndex) {
    this.init(xi, yi, size, noiseOctaves, noiseFalloff, positionIndex);
  }

  init(xi, yi, size, noiseOctaves, noiseFalloff, positionIndex) {
    this.xi = xi;
    this.yi = yi;
    this.size = size;
    this.positionIndex = positionIndex;
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

  nextPositionIndex() {
    this.positionIndex = (this.positionIndex + 1) % cellIndices.length;
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
    this.drawTangentLine();
  }

  drawCircle() {
    noFill();
    strokeWeight(0.7);
    stroke(120);
    ellipse(this.xi, this.yi, this.size, this.size);
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