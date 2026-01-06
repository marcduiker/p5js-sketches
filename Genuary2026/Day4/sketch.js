/// Genuary 2026 - Day 4: Low res
/// Marc Duiker
/// https://marcduiker.dev
/// Jan 2026

let word;
let colors = dreamhaze8;
const fps = 24;
const noiseSeedIndex = 1111;
let bgColor;
let windowW, windowH;
let noiseDelta = 0.1;
let gridSize;
let cells;
let cellSize;
let cellPadding;
let leftMargin, topMargin;
let t;

async function setup() {
  frameRate(fps);
  init();
}

function init() {
  windowW = 800;
  windowH = 800;
  gridSize = 15;
  createCanvas(windowW, windowH);
  noiseDetail(6, 0.3);
  noiseSeed(noiseSeedIndex);
  bgColor = colors[0];
  cells = [];
  t = 0;
  updateGrid();
}

function updateGrid() {
  gridSize = floor(abs(cos(frameCount * 0.0075)) * 48) + 3;
  cellPadding = map(gridSize, 3, 50, 10, 1);
  cells = [];
  leftMargin = 25;
  topMargin = leftMargin;

  cellSize = (windowW - leftMargin * 2 - (cellPadding * gridSize -1)) / (gridSize);
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      cells.push(new Cell(x, y, cellSize, cellPadding, 0));
    }
  }
}

function draw() {
  background(bgColor);
  updateGrid();
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      let cell = cells[x * gridSize + y];
      cell.update();
      cell.draw();
    }
  }
  t += 1;
  //console.log(gridSize, frameCount);
}

function keyPressed() {
  console.log('key pressed', key);
  if (key === 's') {
    let timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    saveGif(`${timestamp}-genuary-4`, 456, { units: 'frames', delay: 0 } );
  }
  return;
}


class Cell {
  constructor(x, y, size, padding, v) {
    this.init(x, y, size, padding, v);
  }

  init(x, y, size, padding, v) {
    this.xi = x;
    this.yi = y;
    this.size = size;
    this.padding = padding;
    this.v = v;
  }

  update() {
    this.x = leftMargin + this.xi * (this.size + this.padding);
    this.y = topMargin + this.yi * (this.size + this.padding);
    let noiseVal = noise(this.xi * noiseDelta, this.yi * noiseDelta, t/100);
    this.v = floor(map(noiseVal, 0, 1, 0, colors.length-1));
    this.color1 = colors[this.v];
    this.color2 = this.v === 0 ? colors[0] : colors[this.v - 1];
    this.scaleFactor = this.xi / gridSize;
  }

  draw() {
    // bg cell
    fill(this.color2);
    noStroke();
    rect(this.x, this.y, this.size, this.size);

    // fg cell
    fill(this.color1);
    noStroke();
    let size = this.size * this.scaleFactor;
    let offset = (this.size - size) / 2;
    rect(this.x + offset, this.y + offset, size, size);
  }
}

function applyAlphaToColor(col, alpha) {
    let c = color(col);
    return color(red(c), green(c), blue(c), alpha);
  }

function windowResized() {
  init();
}

