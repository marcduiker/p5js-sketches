/// Conway's Game of Life
/// Marc Duiker, @marcduiker, Dec 2023

const canvasWidth = 900;
const canvasHeight = 600;
let rows;
let cols;
let cellSize;
let grid = [];
const bgColor = 240;
let isRunning = false;
let speed = 15;
let showLines = false;

function setup() {
    frameRate(speed);
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('canvas');

    const rowsSlider = document.querySelector("#rowsSlider");
    rowsSlider.addEventListener("change", (event) => {
        updateRowsAndColsAndInitGrid();
    });
    const speedSlider = document.querySelector("#speedSlider");
    speedSlider.addEventListener("change", (event) => {
        updateFrameRate();
    });
    updateRowsAndColsAndInitGrid();
}

function initGrid(cols, rows) {
    cellSize = canvasHeight / rows;
    grid = [];
    for (let x = 0; x < cols; x++) {
        grid[x] = [];
        for (let y = 0; y < rows; y++) {
            grid[x][y] = new Cell(x, y, cellSize, 0);
        }
    }
}

function updateRowsAndColsAndInitGrid() {
    rows = select("#rowsSlider").value();
    cols = Math.floor(rows * canvasWidth / canvasHeight)
    if (cols % 2 === 0) cols++;
    initGrid(cols, rows);
    loadRandomSeed();
    initDraw();
}

function updateFrameRate() {
    speed = select("#speedSlider").value();
}

function reset() {
    if (isRunning) {
        toggleRunning();
    }
    showLines = true;

    grid.forEach(row => {
        row.forEach(cell => {
            cell.setInitialState(0);
        });
    });

    initDraw();
}

function saveGrid() {
    localStorage.setItem("grid", JSON.stringify(grid));
}

function loadGrid() {
    const raw = localStorage.getItem("grid");
    grid = [];
    gridUntyped = JSON.parse(raw);
    gridUntyped.forEach(col => {
        grid[col[0].x] = [];
        col.forEach(cell => {
            typedCell = Object.assign(new Cell, cell);
            grid[cell.x][cell.y] = typedCell;
        });
    });
    initDraw();
}

function mouseClicked() {
    drawCells(mouseX, mouseY);
}

function drawCells(mX, mY) {
    if (isRunning) return;
    let cellX = Math.floor(mX / cellSize);
    let cellY = Math.floor(mY / cellSize);
    if (cellX < 0 || cellY < 0) return;
    let initState = grid[cellX][cellY].state === 1 ? 0 : 1;
    grid[cellX][cellY].setInitialState(initState);
    grid[cellX][cellY].draw();
}

function toggleRunning() {
    isRunning = !isRunning;
    if (isRunning) {
        select("#runButton").elt.innerText = 'stop';
    } else {
        select("#runButton").elt.innerText = 'start';
    }
}

function initDraw() {
    grid.forEach(row => {
        row.forEach(cell => {
            cell.draw();
        });
    });
}

function loadRandomSeed() {
    for (x = 0; x < Math.ceil(cols/2); x++) {
        for (y = 0; y < Math.ceil(rows/2); y++) {
            const cellValue = random([0, 1]);
            grid[x][y].setInitialState(cellValue);
            grid[cols - x - 1][y].setInitialState(cellValue);
            grid[x][rows - y - 1].setInitialState(cellValue);
            grid[cols - x - 1][rows - y - 1].setInitialState(cellValue);
        }
    };
    showLines = false;
}

function draw() {
    frameRate(speed);
    background(bgColor);
    if (isRunning) {
        grid.forEach(row => {
            row.forEach(cell => {
                cell.update();
                cell.draw();
            });
        });
    }
    
    if (!isRunning) {
        grid.forEach(row => {
            row.forEach(cell => {
                cell.draw();
            });
        });
        drawHelperLines();
    }
    
    if (isRunning) {
        grid.forEach(row => {
            row.forEach(cell => {
                cell.updateState();
            });
        });
    }
}

function drawHelperLines() {
    if (!showLines) return;
    stroke(0, 0, 250);
    strokeWeight(2);
    line(0, rows/2 * cellSize, canvasWidth, rows/2 * cellSize);
    line(cols/2 * cellSize, 0, cols/2 * cellSize, canvasHeight);
}

function loadTestSeed() {
    const seed = [
        [1, 2], //blinker
        [2, 2], //blinker
        [3, 2], //blinker

        [7, 2], // toad
        [8, 2], // toad
        [9, 2], // toad
        [6, 3], // toad
        [7, 3], // toad
        [8, 3], // toad
        
        [12, 1], // beacon
        [13, 1], // beacon
        [12, 2], // beacon
        [13, 2], // beacon
        [14, 3], // beacon
        [15, 3], // beacon
        [14, 4], // beacon
        [15, 4], // beacon
        
        [26, 2], // Penta-decathlon
        [27, 2], // Penta-decathlon
        [28, 2], // Penta-decathlon
        [27, 3], // Penta-decathlon
        [27, 4], // Penta-decathlon
        [26, 5], // Penta-decathlon
        [27, 5], // Penta-decathlon
        [28, 5], // Penta-decathlon

        [26, 7], // Penta-decathlon
        [27, 7], // Penta-decathlon
        [28, 7], // Penta-decathlon
        [26, 8], // Penta-decathlon
        [27, 8], // Penta-decathlon
        [28, 8], // Penta-decathlon

        [26, 10], // Penta-decathlon
        [27, 10], // Penta-decathlon
        [28, 10], // Penta-decathlon
        [27, 11], // Penta-decathlon
        [27, 12], // Penta-decathlon
        [26, 13], // Penta-decathlon
        [27, 13], // Penta-decathlon
        [28, 13], // Penta-decathlon

        [2, 7], // block
        [3, 7], // block
        [2, 8], // block
        [3, 8], // block

        [7, 7], // boat
        [8, 7], // boat
        [7, 8], // boat
        [8, 9], // boat
        [9, 8], // boat

        [12, 8], // tub
        [13, 7], // tub
        [13, 9], // tub
        [14, 8], // tub

        [17, 8], // beehive
        [18, 7], // beehive
        [18, 9], // beehive
        [19, 7], // beehive
        [19, 9], // beehive
        [20, 8], // beehive

        [3, 12], //glider
        [4, 13], //glider
        [2, 14], //glider
        [3, 14], //glider
        [4, 14], //glider
    ];

    seed.forEach(item => {
        grid[item[0]][item[1]].setInitialState(1);
    });
}

class Cell {
    constructor(x, y, size, state) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.state = state;
        this.newState = 0;
        this.neighbourCount = 0;
        this.overpopulationCount = 3;
        this.underpopulationCount = 2;
        this.reproductionCount = 3;
    }

    update() {
        this.neighbourCount = 0;
        for (let i = -1; i < 2; i++) {
            if (this.x + i < 0 || this.x + i >= cols) continue;
            for (let j = -1; j < 2; j++) {
                if (i === 0 && j === 0) continue;
                if (this.y + j < 0 || this.y + j >= rows) continue;
                const x = this.x + i;
                const y = this.y + j;
                this.neighbourCount += grid[x][y].state;
            }
        }
        if (this.state === 1) {
            if (this.neighbourCount > this.overpopulationCount) {
                this.newState = 0;
            } else if (this.neighbourCount < this.underpopulationCount) {
                this.newState = 0;
            } else {
                this.newState = 1;
            }
        } else {
            if (this.neighbourCount === this.reproductionCount) {
                this.newState = 1;
            }
        }
    }

    updateState() {
        this.state = this.newState !== undefined ? this.newState : this.state;
    }

    setInitialState(state) {
        this.state = state;
        this.newState = state;
    }

    draw() {
        stroke(color(100));
        strokeWeight(0.5);
        fill(this.getFillColor());
        let xPos = this.x * this.size;
        let yPos = this.y * this.size;
        rect(xPos, yPos, xPos + this.size, yPos + this.size);
    }

    getFillColor() {
        let fillColor =  this.state === 1 ? color(0) : color(bgColor);
        return fillColor;
    }
}
