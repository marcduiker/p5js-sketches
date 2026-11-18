/// Genuary 2026 - Day 9: Crazy automaton. Cellular automata with crazy rules.
/// Marc Duiker
/// https://marcduiker.dev
/// Jan 2026

let word;
let colors = dreamhaze8;
const fps = 24;
let bgColor;
let windowW, windowH;
let gridSize;
let cells;
let cellSize;
let cellPadding;
let leftMargin, topMargin;
let y;
let ruleIndex;
let ruleString;

async function setup() {
  frameRate(fps);
  init();
}

function init() {
  windowW = 700;
  windowH = 700;
  gridSize = 121; // Use a uneven number
  createCanvas(windowW, windowH);
  bgColor = colors[0];
  y = 0;
  updateGrid();
  ruleString = "00011110"; //"00011110"; //"11000010" //"10101001"
  console.log('rule:', ruleString);
}

function shiftRuleString() {
  ruleString = ruleString.substring(1) + ruleString.substring(0, 1);
}

function createRuleString() {
  ruleString = "";
  for ( let j = 0; j < 8; j++) {
    ruleString += nf(random([0,1]));
  }
  let oneCount = (ruleString.match(/1/g) || []).length;
  if (oneCount < 3 || oneCount > 6)
  {
    createRuleString();
  }
}

function updateGrid() {
  cellPadding = 1;
  cells = [];
  leftMargin = 25;
  topMargin = leftMargin;

  cellSize = (windowW - leftMargin * 2 - (cellPadding * gridSize -1)) / (gridSize);
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      cells.push(new Cell(x, y, cellSize, cellPadding));
    }
  }
}

function draw() {
  background(applyAlphaToColor(bgColor, 5));
  for (let x = 0; x < gridSize; x++) {
    let cell = cells[x * gridSize + y];
    cell.update();
    cell.draw();
  }
  y++;
  if (y >= gridSize) {
    shiftRuleString();
    //createRuleString();
    console.log('rule:', ruleString);
    y = 0;
    for (let x = 0; x < gridSize; x++) {
      let cell = cells[x * gridSize + y];
      cell.setRandomValues();
    }
  }
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
    this.v = this.minV;
    this.setRandomValues(); // this.setCenterValue();
  }

  setCenterValue() {
    if (this.yi === 0 && this.xi === (floor(gridSize/2))) {
      this.v = this.maxV;
    }
  }

  setRandomValues() {
    if (this.yi === 0) {
      this.v = random([this.minV, this.maxV]);
    }
  }

  update() {
    let sumString = this.sumStringNeighborValues(3);
    let newValue;
    newValue = genericRule(sumString, this.v);
    this.updateNewCell(newValue);
  }

  updateNewCell(v) {
    if (this.yi < gridSize - 1) {
      cells[(this.xi) * gridSize + this.yi + 1].v = v;
    }
  }

  sumStringNeighborValues(size) {
    let sumString = '';
    let delta = floor(size/2);
    let val;
    for (let dx = -delta; dx < delta + 1; dx++) {
        // skip out of bounds
        if (this.xi + dx < 0 || this.xi + dx >= gridSize) continue;
        val = cells[(this.xi + dx) * gridSize + this.yi].v;
        sumString += nf(val);
    }
    return sumString;
  }

  draw() {
    let cellColor = this.v === 1 ? random([colors[2], colors[4]]) : colors[0];
    fill(cellColor);
    noStroke();
    rect(this.x, this.y, this.size, this.size);
  }
}

function genericRule(sumString, v) {
    let newValue;
    switch(sumString) {
      case "000":
        newValue = ruleString[0];
        break;
      case "001":
        newValue = ruleString[1];
        break;
      case "010":
        newValue = ruleString[2];
        break;
      case "011":
          newValue = ruleString[3];
          break;
      case "100":
        newValue = ruleString[4];
        break;
      case "101":
        newValue = ruleString[5];
        break;
      case "110":
        newValue = ruleString[6];
        break;
      case "111":
        newValue = ruleString[7];
        break;
      default:
        newValue = v;
    }
    return int(newValue);
  }

function applyAlphaToColor(col, alpha) {
    let c = color(col);
    return color(red(c), green(c), blue(c), alpha);
  }

function windowResized() {
  init();
}

