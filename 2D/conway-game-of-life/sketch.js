// Wave Function Collapse (tiled model)
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/challenges/171-wave-function-collapse
// https://youtu.be/0zac-cDzJwA

// Code from Challenge: https://editor.p5js.org/codingtrain/sketches/pLW3_PNDM
// Corrected and Expanded: https://github.com/CodingTrain/Wave-Function-Collapse

let manual = true;
let grid = [];
let newGrid = [];
const dimensionX = 20;
const resolutionX = 800;
const resolutionY = 600;
const dimensionY = Math.floor((dimensionX * resolutionY) / resolutionX);
const cellWidth = resolutionX / dimensionX;
const cellHeight = resolutionY / dimensionY;

function setup() {
    frameRate(5);
    createCanvas(resolutionX, resolutionY);
    startOver();
    seedCells();
}

function seedCells() {}

function startOver() {
    grid = [];
    for (let y = 0; y < dimensionY; y++) {
        for (let x = 0; x < dimensionX; x++) {
            grid.push(new Cell(x, y));
        }
    }
}

function keyTyped() {
    if (key === "s") {
        saveCanvas("GameOfLife", "png");
    }
    if (key === "r") {
        startOver();
    }
    if (key === "m") {
        manual = !manual;
    }
}

function mouseClicked() {
    const x = Math.floor(mouseX / cellWidth);
    const y = Math.floor(mouseY / cellHeight);
    const gridIndex = x + y * dimensionX;
    grid[gridIndex].isDead = false;
}

function draw() {
    background(0);
    newGrid = [];
    if (!manual) {
        for (let y = 0; y < dimensionY; y++) {
            for (let x = 0; x < dimensionX; x++) {
                let neighbors = [];
                const sourceIndex = x + y * dimensionX;
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        const neighborIndex = x + dx + (y + dy) * dimensionX;
                        // this wraps around the rows :/
                        if (sourceIndex != neighborIndex && neighborIndex >= 0 && neighborIndex < grid.length) {
                            neighbors.push(grid[neighborIndex]);
                        }
                    }
                }
                newGrid.push(grid[sourceIndex].getNewState(neighbors));
            }
        }

        grid = newGrid;
    }

    for (let i = 0; i < grid.length; i++) {
        grid[i].draw();
    }
}
