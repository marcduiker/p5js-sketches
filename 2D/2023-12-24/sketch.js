/// Space debris
/// Marc Duiker, @marcduiker, Dec 2023

let rows = 32;
let cols = 32;
let cellSize;
let grid = [];
let cells = [];
const bgColor = 240;
let canvasSize = 600
let isRunning = false;
let speed = 2;
let runButton;
let resetButton;
let slider;

function setup() {
    frameRate(speed);
    createCanvas(canvasSize, canvasSize);
    runButton = createButton('start');
    runButton.mousePressed(() => {
        toggleRunning();
    });
    runButton.position(0, 0);

    resetButton = createButton('reset');
    resetButton.mousePressed(() => {
        reset();
    });
    resetButton.position(200, 0);

    slider = createSlider(1, 15, speed);
    slider.position(60, 0);
    cellSize = canvasSize / cols;
    for (let x = 0; x < cols; x++) {
        grid[x] = [];
        for (let y = 0; y < rows; y++) {
            grid[x][y] = new Cell(x, y, cellSize, 0);
        }
    }
    //loadSeed();
    initDraw();
}

function reset() {
    grid.forEach(row => {
        row.forEach(cell => {
            cell.setInitialState(0);
        });
    });

    initDraw();
}

function mouseClicked() {
    if (isRunning) return;
    let cellX = Math.floor(mouseX / cellSize);
    let cellY = Math.floor(mouseY / cellSize);
    console.log(cellX, cellY);
    let initState = grid[cellX][cellY].state === 1 ? 0 : 1;
    grid[cellX][cellY].setInitialState(initState);
    grid[cellX][cellY].draw();
}

function toggleRunning() {
    isRunning = !isRunning;
    if (isRunning) {
        runButton.elt.innerText = 'stop';
    } else {
        runButton.elt.innerText = 'start';
    }
}

function initDraw() {
    grid.forEach(row => {
        row.forEach(cell => {
            cell.draw();
        });
    });
}

function loadSeed() {

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

function draw() {
    frameRate(slider.value());

    background(bgColor);
    if (isRunning) {
        grid.forEach(row => {
            row.forEach(cell => {
                cell.update();
            });
        });
    }
        
    background(bgColor);
    grid.forEach(row => {
        row.forEach(cell => {
            cell.draw();
        });
    });

    if (isRunning) {
        grid.forEach(row => {
            row.forEach(cell => {
                cell.updateState();
            });
        });
    }
}


class Cell {
    constructor(x, y, size, state) {
        this.x = x;
        this.y = y;
        this.xPos = x * size;
        this.yPos = y * size;
        this.size = size;
        this.state = state;
        this.newState = 0;
        this.color = color(0);
        this.thickness = 1;
        this.neighbourCount = 0;
        this.debugBefore = `Before ${x},${y},${this.state} - `;
        this.debugAfter = 'After ';
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
                this.debugBefore += `${x},${y},${grid[x][y].state} - `;
                this.neighbourCount += grid[x][y].state;
            }
        }
        //console.log(this.debugBefore);
        if (this.state === 1) {
            if (this.neighbourCount > 3) {
                this.newState = 0;
            } else if (this.neighbourCount < 2) {
                this.newState = 0;
            } else {
                this.newState = 1;
            }
        } else {
            if (this.neighbourCount === 3) {
                this.newState = 1;
            }
        }
        this.debugAfter += `${this.x},${this.y},${this.newState} - `;
        //console.log(this.debugAfter);
    }

    updateState() {
        this.state = this.newState !== undefined ? this.newState : this.state;
    }

    setInitialState(state) {
        this.state = state;
    }

    draw() {
        stroke(this.color);
        strokeWeight(this.thickness);
        let fillColor = this.state === 1 ? color(0) : color(bgColor);
        fill(fillColor);
        rect(this.xPos, this.yPos, this.xPos + this.size, this.yPos + this.size);
        //const label = `${this.neighbourCount}-${this.state}`;
        //textAlign(CENTER);
        //let textColor = this.state == 1 ? color(bgColor) : color(0);
        //noStroke();
        //fill(textColor);
        //text(label, this.xPos + this.size / 2, this.yPos + this.size / 2);
    }
}
