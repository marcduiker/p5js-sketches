// Wave Function Collapse (tiled model)
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/challenges/171-wave-function-collapse
// https://youtu.be/0zac-cDzJwA

// Code from Challenge: https://editor.p5js.org/codingtrain/sketches/pLW3_PNDM
// Corrected and Expanded: https://github.com/CodingTrain/Wave-Function-Collapse

let manual = true;
let grid = [];
const tileImages = [];
const dimensionX = 70;
const resolutionX = 1600;
const resolutionY = 800;
const dimensionY = Math.floor((dimensionX * resolutionY) / resolutionX);
const cellWidth = resolutionX / dimensionX;
const cellHeight = resolutionY / dimensionY;

function preload() {
  const path = "tiles";
  for (let i = 0; i < nrOfImages; i++) {
    tileImages[i] = loadImage(`${path}/${i}.png`);
  }
}

function setup() {
  createCanvas(resolutionX, resolutionY);
  textFont("monospace");
  textSize(12);
  textAlign(CENTER, CENTER);

  loadTiles();

  startOver();
  seedCells();
}

function seedCells() {
  const charHeight = Math.floor(dimensionY / 4 * 3);
  const startHeight = Math.floor(dimensionY / 4);
  const charWidthA = Math.floor(dimensionX / 8);
  const charWidthR = Math.floor(dimensionX / 8);
  const charWidthC = Math.floor(dimensionX / 8);
  const charWidthM = Math.floor(dimensionX / 5.5);
  const lineThickness = 3;
  const kerning = 4;

  // M
  let allChars = [];
  const startM = kerning + 1;
  for (let i = startHeight; i < charHeight; i++) {
    for (let w = 0; w < lineThickness; w++) {
      allChars.push([startM + w, i]);
    }
    for (let w = 0; w < lineThickness; w++) {
      allChars.push([startM + charWidthM + w, i]);
    }
  }
  // A
  const startA = startM + charWidthM + kerning * 2 - 1;
  for (let i = startHeight + lineThickness; i < charHeight; i++) {
    for (let w = 0; w < lineThickness; w++) {
      allChars.push([startA + w, i]);
    }
    for (let w = 0; w < lineThickness; w++) {
      allChars.push([startA + charWidthA + w, i]);
    }
  }
  // A horizontal parts
  for (let j = startA + lineThickness; j < startA + charWidthA; j++) {
    for (let w = 0; w < lineThickness; w++) {
      allChars.push([j, startHeight + w]);
    }
  }
  for (let j = startA + lineThickness; j < startA + charWidthA; j++) {
    for (let w = 0; w < lineThickness; w++) {
      allChars.push([j, startHeight + lineThickness * 3 + w]);
    }
  }
  // R
  const startR = startA + charWidthA + kerning * 2 - 1;
  for (let i = startHeight; i < charHeight; i++) {
    for (let w = 0; w < lineThickness; w++) {
      allChars.push([startR + w, i]);
    }
    if (i > startHeight + lineThickness - 1) {
      for (let w = 0; w < lineThickness; w++) {
        allChars.push([startR + charWidthR + w, i]);
      }
    }
  }
  // R horizontal parts
  for (let j = startR + lineThickness; j < startR + charWidthR; j++) {
    for (let w = 0; w < lineThickness; w++) {
      allChars.push([j, startHeight + w]);
    }
  }
  for (let j = startR+lineThickness; j < startR + charWidthR; j++) {
    for (let w = 0; w < lineThickness; w++) {
      allChars.push([j, startHeight + lineThickness * 3 + w]);
    }
  }

  // C
  const startC = startR + charWidthR + kerning * 2 - 1;
  for (let i = startHeight + lineThickness; i < charHeight - lineThickness; i++) {
    for (let w = 0; w < lineThickness; w++) {
      allChars.push([startC + w, i]);
    }
  }
  // C horizontal parts
  for (let j = startC + lineThickness; j < startC + charWidthC + lineThickness; j++) {
    for (let w = 0; w < lineThickness; w++) {
      allChars.push([j, startHeight + w]);
    }
  }
  for (let j = startC + lineThickness; j < startC + charWidthC + lineThickness; j++) {
    for (let w = 0; w < lineThickness; w++) {
      allChars.push([j, charHeight - w - 1]);
    }
  }

  for (const char of allChars) {
      const gridIndex = char[1] * dimensionX + char[0];
      let cell = grid[gridIndex];
      cell.collapsed = true;
      cell.options = [0];
  }
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
  if (key === "s") {
    saveCanvas("WaveFunctionCollapse", "png");
  }
  if (key === "r") {
    startOver();
  }
  if (key === "m") {
    manual = !manual;
  }
}

function mouseClicked() {
  // convert mouseX and mouseY to grid index
  const i = Math.floor(mouseX / cellWidth);
  const j = Math.floor(mouseY / cellHeight);
  const gridIndex = i + j * dimensionX;
  let cell = grid[gridIndex];
  cell.collapsed = true;
  cell.options = [0];
}

function draw() {
  background(0);

  for (let j = 0; j < dimensionY; j++) {
    for (let i = 0; i < dimensionX; i++) {
      const gridIndex = j * dimensionX + i;
      let cell = grid[gridIndex];
      if (cell.collapsed) {
        let index = cell.options[0];
        image(
          tiles[index].img,
          i * cellWidth,
          j * cellHeight,
          cellWidth,
          cellHeight
        );
      } else {
        noFill();
        stroke(cell.strokeColor);
        rect(i * cellWidth, j * cellHeight, cellWidth, cellHeight);
        stroke(map(cell.entropy, 1, tiles.length, 255, 30));
        text(
          cell.entropy,
          i * cellWidth + cellWidth / 2,
          j * cellHeight + cellHeight / 2
        );
      }
    }
  }

  if (!manual) {
    // Pick cell with least entropy
    let gridCopy = grid.slice();
    gridCopy = gridCopy.filter((a) => !a.collapsed);

    if (gridCopy.length == 0) {
      return;
    }
    gridCopy.sort((a, b) => {
      return a.options.length - b.options.length;
    });

    let nrOfOptions = gridCopy[0].options.length;
    let stopIndex = 0;
    for (let i = 1; i < gridCopy.length; i++) {
      if (gridCopy[i].options.length > nrOfOptions) {
        stopIndex = i;
        break;
      }
    }

    if (stopIndex > 0) gridCopy.splice(stopIndex);
    const cell = random(gridCopy);
    cell.collapsed = true;
    const pick = pickTile(cell.options);
    cell.options = [pick];
    if (pick === undefined) {
      //startOver();
      console.log("pick is undefined");
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

}

function pickTile(cellOptions) {
  const sortedOptions = cellOptions.sort((a, b) => {
    return tiles[b].priority - tiles[a].priority;
  });
  const maxLen = sortedOptions.length > 2 ? 3 : sortedOptions.length;
  const prioOptions = sortedOptions.slice(0, maxLen);
  return random(prioOptions);
}
