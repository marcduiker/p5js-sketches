/// Genuary 2026 - Day 9: Crazy automaton. Cellular automata with crazy rules.
/// Marc Duiker
/// https://marcduiker.dev
/// Jan 2026

let word;
let colors = dreamhaze8;
const fps = 3;
const noiseSeedIndex = 10;
let bgColor;
let windowW, windowH;
let noiseDelta = 0.1;
let gridSize;
let cells;
let cellSize;
let cellPadding;
let leftMargin, topMargin;
let currentVName;

async function setup() {
  frameRate(fps);
  init();
}

function init() {
  windowW = 700;
  windowH = 700;
  gridSize = 25;
  createCanvas(windowW, windowH);
  noiseDetail(6, 0.3);
  noiseSeed(noiseSeedIndex);
  bgColor = colors[0];
  updateGrid();
}

function updateGrid() {
  cellPadding = 5;
  cells = [];
  leftMargin = 25;
  topMargin = leftMargin;
  currentVName = 'v1';

  cellSize = (windowW - leftMargin * 2 - (cellPadding * gridSize -1)) / (gridSize);
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      cells.push(new Cell(x, y, cellSize, cellPadding));
    }
  }
}

function draw() {
  background(bgColor);
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      let cell = cells[x * gridSize + y];
      cell.update();
      cell.draw();
    }
  }
  if (currentVName === 'v1') {
    currentVName = 'v2';
  } else {
    currentVName = 'v1';
  }
  console.log('switched to', currentVName);
}

function keyPressed() {
  console.log('key pressed', key);
  if (key === 's') {
    let timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    saveGif(`${timestamp}-genuary-9`, 360, { units: 'frames' } );
  }
  return;
}


class Cell {
  constructor(x, y, size, padding) {
    this.init(x, y, size, padding);
  }

  init(x, y, size, padding) {
    this.xi = x;
    this.yi = y;
    this.size = size;
    this.padding = padding;
    this.x = leftMargin + this.xi * (this.size + this.padding);
    this.y = topMargin + this.yi * (this.size + this.padding);
    this.minV = 0;
    this.maxV = 1;
    this.v1 = random([this.minV, this.maxV]);
    this.v2 = this.val1;
  }

  update() {
    let sumString = this.sumStringNeighborValues(3);
    let newValue;
    switch(sumString) {
      case "000":
        newValue = 1;
        break;
      case "001":
        newValue = 1;
        break;
      case "010":
        newValue = 0;
        break;
      case "100":
        newValue = 1;
        break;
      case "101":
        newValue = 1;
        break;
      case "110":
        newValue = 0;
        break;
      case "011":
        newValue = 0;
        break;
      case "111":
        newValue = 0;
        break;
      default:
        newValue = random([this.minV, this.maxV]);
        break;
    }
    if (currentVName === 'v1') {
      this.v2 = newValue;
    } else {
      this.v1 = newValue;
    }
  }

  sumStringNeighborValues(size) {
    let sumString = '';
    let delta = floor(size/2);
    for (let dx = -delta; dx < delta + 1; dx++) {
        // skip out of bounds
        if (this.xi + dx < 0 || this.xi + dx >= gridSize) continue;
        if (currentVName === 'v1') {
          let val1 = cells[(this.xi + dx) * gridSize + this.yi].v1;
          sumString += nf(val1);
        } else {
          let val2 = cells[(this.xi + dx) * gridSize + this.yi].v2;
          sumString += nf(val2);
        }
    }
    return sumString;
  }

  draw() {
    if (currentVName === 'v1') {
      fill(colors[this.v2])
    } else {
      fill(colors[this.v1])
    }
    noStroke();
    rect(this.x, this.y, this.size, this.size);
  }
}

function applyAlphaToColor(col, alpha) {
    let c = color(col);
    return color(red(c), green(c), blue(c), alpha);
  }

function windowResized() {
  init();
}

