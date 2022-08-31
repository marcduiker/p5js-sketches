// Wave Function Collapse (tiled model)
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/challenges/171-wave-function-collapse
// https://youtu.be/0zac-cDzJwA

// Code from Challenge: https://editor.p5js.org/codingtrain/sketches/pLW3_PNDM
// Corrected and Expanded: https://github.com/CodingTrain/Wave-Function-Collapse

let tiles = [];
let grid = [];
const tileImages = [];
const nrOfImages = 12;
const dimensionX = 50;
const resolutionX = 1920;
const resolutionY = 1080;
const dimensionY = Math.floor(dimensionX * resolutionY / resolutionX);
const cellWidth = resolutionX / dimensionX;
const cellHeight = resolutionY / dimensionY;

function preload() {
  const path = "tiles";
  for (let i = 0; i < nrOfImages; i++) {
    tileImages[i] = loadImage(`${path}/${i}.png`);
  }
}

function removeDuplicatedTiles(tiles) {
  const uniqueTilesMap = {};
  for (const tile of tiles) {
    const key = tile.edges.join(','); // ex: "ABB,BCB,BBA,AAA"
    uniqueTilesMap[key] = tile;
  }
  return Object.values(uniqueTilesMap);
}


function setup() {
  createCanvas(resolutionX, resolutionY);
  textFont('monospace');
  textSize(12);
  textAlign(CENTER, CENTER);

  // Create and label the tiles
  tiles[0] = new Tile(tileImages[0], ["A", "A", "A", "A"]);
  tiles[1] = new Tile(tileImages[1], ["B", "A", "B", "A"]);
  tiles[2] = new Tile(tileImages[2], ["B", "B", "B", "B"]);
  tiles[3] = new Tile(tileImages[3], ["A", "B", "A", "B"]);
  tiles[4] = new Tile(tileImages[4], ["B", "B", "A", "A"]);
  tiles[5] = new Tile(tileImages[5], ["B", "C", "B", "A"]);
  tiles[6] = new Tile(tileImages[6], ["B", "DE", "ED", "A"]);
  tiles[7] = new Tile(tileImages[7], ["B", "A", "DE", "ED"]);
  tiles[8] = new Tile(tileImages[8], ["DE", "F", "ED", "A"]);
  tiles[9] = new Tile(tileImages[9], ["B", "B", "B", "A"]);
  tiles[10] = new Tile(tileImages[10], ["B", "A", "A", "A"]);
  tiles[11] = new Tile(tileImages[11], ["A", "C", "A", "B"]);
  
  for (let i = 0; i < nrOfImages; i++) {
    tiles[i].index = i;
  }

  // Only rotate tiles 4-8
  for (let i = 4; i < nrOfImages + 1; i++) {
    let tempTiles = [];
    for (let j = 0; j < 4; j++) {
      tempTiles.push(tiles[i].rotate(j));
    }
    tempTiles = removeDuplicatedTiles(tempTiles);
    tiles = tiles.concat(tempTiles);
  }
  //console.log(tiles.length);

  // Generate the adjacency rules based on edges
  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];
    tile.analyze(tiles);
  }

  startOver();
}

function startOver() {
  // Create cell for each spot on the grid
  for (let i = 0; i < dimensionX * dimensionY; i++) {
    grid[i] = new Cell(tiles.length);
  }
}

function checkValid(arr, valid) {
  for (let i = arr.length - 1; i >= 0; i--) {
    let element = arr[i];
    if (!valid.includes(element)) {
      arr.splice(i, 1);
    }
  }
}

function keyTyped() {
  if (key === 'r') {
    startOver();
  }
}

function keyTyped(){
  // save image canvas
  if (key === 's') {
    saveCanvas('WaveFunctionCollapse', 'png');
  }
}

function draw() {
  background(0);

  for (let j = 0; j < dimensionY; j++) {
    for (let i = 0; i < dimensionX; i++) {
      const gridIndex = j * dimensionX + i;
      let cell = grid[gridIndex];
      if (cell && cell.collapsed) {
        let index = cell.options[0];
        image(tiles[index].img, i * cellWidth, j * cellHeight, cellWidth, cellHeight);
      } else {
        noFill();
        stroke(cell.strokeColor);
        rect(i * cellWidth, j * cellHeight, cellWidth, cellHeight);
        stroke(map(cell.entropy, 1, tiles.length, 255, 30));
        text(cell.entropy, i * cellWidth + cellWidth / 2, j * cellHeight + cellHeight / 2);
      }
    }
  }

  // Pick cell with least entropy
  let gridCopy = grid.slice();
  gridCopy = gridCopy.filter((a) => !a.collapsed);
  //console.table(grid);
  //console.table(gridCopy);

  if (gridCopy.length == 0) {
    return;
  }
  gridCopy.sort((a, b) => {
    return a.options.length - b.options.length;
  });

  let len = gridCopy[0].options.length;
  let stopIndex = 0;
  for (let i = 1; i < gridCopy.length; i++) {
    if (gridCopy[i].options.length > len) {
      stopIndex = i;
      break;
    }
  }

  if (stopIndex > 0) gridCopy.splice(stopIndex);
  const cell = random(gridCopy);
  cell.collapsed = true;
  const pick = random(cell.options);
  cell.options = [pick];
  if (pick === undefined) {
    //startOver();
    console.log("pick is undefined")
    //return;
  }

  const nextGrid = [];
  for (let j = 0; j < dimensionY; j++) {
    for (let i = 0; i < dimensionX; i++) {
      const gridIndex = j * dimensionX + i;
      if (grid[gridIndex].collapsed) {
        nextGrid[gridIndex] = grid[gridIndex];
      } else {
        let options = new Array(tiles.length).fill(0).map((x, i) => i);
        // Look up
        if (j > 0) {
          let up = grid[i + (j - 1) * dimensionX];
          let validOptions = [];
          for (let option of up.options) {
            let valid = tiles[option].down;
            validOptions = validOptions.concat(valid);
          }
          checkValid(options, validOptions);
        }
        // Look right
        if (i < dimensionX - 1) {
          let right = grid[i + 1 + j * dimensionX];
          let validOptions = [];
          for (let option of right.options) {
            let valid = tiles[option].left;
            validOptions = validOptions.concat(valid);
          }
          checkValid(options, validOptions);
        }
        // Look down
        if (j < dimensionY - 1) {
          let down = grid[i + (j + 1) * dimensionX];
          let validOptions = [];
          for (let option of down.options) {
            let valid = tiles[option].up;
            validOptions = validOptions.concat(valid);
          }
          checkValid(options, validOptions);
        }
        // Look left
        if (i > 0) {
          let left = grid[i - 1 + j * dimensionX];
          let validOptions = [];
          for (let option of left.options) {
            let valid = tiles[option].right;
            validOptions = validOptions.concat(valid);
          }
          checkValid(options, validOptions);
        }

        // I could immediately collapse if only one option left?
        nextGrid[gridIndex] = new Cell(options);
      }
    }
  }

  grid = nextGrid;
}