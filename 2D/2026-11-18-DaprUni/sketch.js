/// Genuary 2026 - Day 9 (Dapr University edition): Crazy automaton.
/// Cellular automata with crazy rules, in Dapr University badge colors.
/// Marc Duiker
/// https://marcduiker.dev
/// Jan 2026
///
/// Click the sketch to start the next pattern immediately.

let colors = daprUni;
let cellColors = daprUniCellColors;
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

// Rule strings: index 0 is the result for neighborhood "000", index 7 for "111".
// The first three are the originals; the rest are derived from Wolfram rule numbers.
const originalRules = ["00011110", "11000010", "10101001"];
const wolframRules = [
  30, 45, 54, 57, 60, 73, 86, 89, 90, 99, 102, 105, 106, 110,
  120, 122, 124, 126, 129, 135, 137, 147, 149, 150, 153, 161,
  165, 169, 182, 193, 195, 225,
];
let rules;

function setup() {
  frameRate(fps);
  rules = originalRules.concat(wolframRules.map(wolframToRuleString));
  init();
}

function init() {
  windowW = 500;
  windowH = 500;
  gridSize = 81; // Use an uneven number
  createCanvas(windowW, windowH);
  bgColor = colors[0];
  background(bgColor);
  y = 0;
  updateGrid();
  ruleIndex = 0;
  setRule(rules[ruleIndex]);
}

// Converts a Wolfram rule number (0-255) to a rule string where
// character i is the new state for the neighborhood with binary value i.
function wolframToRuleString(n) {
  let s = "";
  for (let i = 0; i < 8; i++) {
    s += (n >> i) & 1;
  }
  return s;
}

function setRule(rs) {
  ruleString = rs;
  console.log("rule:", ruleString);
}

function nextRule() {
  ruleIndex = (ruleIndex + 1) % rules.length;
  // Every full cycle through the list, use rotated variations of the rules
  if (ruleIndex === 0) {
    rules = rules.map(shiftRuleString);
  }
  setRule(rules[ruleIndex]);
}

function shiftRuleString(rs) {
  return rs.substring(1) + rs.substring(0, 1);
}

function updateGrid() {
  cellPadding = 1;
  cells = [];
  leftMargin = 25;
  topMargin = leftMargin;

  cellSize = (windowW - leftMargin * 2 - (cellPadding * gridSize - 1)) / gridSize;
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      cells.push(new Cell(x, y, cellSize, cellPadding));
    }
  }
}

function draw() {
  background(applyAlphaToColor(bgColor, 8));
  for (let x = 0; x < gridSize; x++) {
    let cell = cells[x * gridSize + y];
    cell.update();
    cell.draw();
  }
  y++;
  if (y >= gridSize) {
    startNextPattern();
  }
}

function startNextPattern() {
  nextRule();
  y = 0;
  for (let x = 0; x < gridSize; x++) {
    cells[x * gridSize + y].setRandomValues();
  }
}

function mousePressed() {
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;
  background(bgColor); // clear the unfinished pattern
  startNextPattern();
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
    if (this.yi === 0 && this.xi === floor(gridSize / 2)) {
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
    let newValue = genericRule(sumString, this.v);
    this.updateNewCell(newValue);
  }

  updateNewCell(v) {
    if (this.yi < gridSize - 1) {
      cells[this.xi * gridSize + this.yi + 1].v = v;
    }
  }

  sumStringNeighborValues(size) {
    let sumString = "";
    let delta = floor(size / 2);
    for (let dx = -delta; dx < delta + 1; dx++) {
      // skip out of bounds
      if (this.xi + dx < 0 || this.xi + dx >= gridSize) continue;
      sumString += nf(cells[(this.xi + dx) * gridSize + this.yi].v);
    }
    return sumString;
  }

  draw() {
    let cellColor = this.v === 1 ? random(cellColors) : colors[0];
    fill(cellColor);
    noStroke();
    rect(this.x, this.y, this.size, this.size);
  }
}

function genericRule(sumString, v) {
  // Out-of-bounds neighborhoods (edges) have only 2 characters: keep the value
  if (sumString.length !== 3) {
    return v;
  }
  return int(ruleString[parseInt(sumString, 2)]);
}

function applyAlphaToColor(col, alpha) {
  let c = color(col);
  return color(red(c), green(c), blue(c), alpha);
}

function windowResized() {
  init();
}
