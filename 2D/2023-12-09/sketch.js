/// Marc Duiker, @marcduiker, Dec 2023

let movingItems = [];
let clipItems = [];
const numItems = 200;

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(15);
    for (let i = 0; i < numItems; i++) {
        let x = 0;
        let y = random(0, windowHeight);
        movingItems.push(new HorizontalLine(i, x, y, windowWidth, windowHeight));
        // y = 0;
        // x = random(0, windowWidth);
        // clipItems.push(new VerticalLine(i, x, y, windowWidth, windowHeight));
    }
}


function draw() {
    background(240);

    movingItems.forEach(item => {
        item.update();
        item.draw();
    });
    // clipItems.forEach(item => {
    //     item.update();
    //     item.draw();
    // });
}


class HorizontalLine {
    constructor(id, x, y, maxX, maxY) {
        this.id = id;
        this.x1 = x;
        this.y1 = y;
        this.y2 = this.y1;
        this.maxX = maxX;
        this.maxY = maxY;
        this.init();
    }

    init() {
        this.z = random(0, 1);
        this.stepSize = map(this.z, 0, 1, 1, 10)
        this.len = map(this.z, 0, 1, 10, 200);
        this.alpha = map(this.z, 0, 1, 0, 240);
        this.x1 = 0 - this.len;
        this.x2 = 0;
        this.thickness = map(this.z, 0, 1, 0.5, 5);
    }

    update() {
        this.x1 = this.x1 + this.stepSize;
        this.x2 = this.x1 + this.len;
        if (this.x1 > this.maxX) {
           this.init();
        }
    }

    draw() {
        stroke(0, this.alpha);
        strokeWeight(this.thickness);
        strokeCap(SQUARE);
        line(this.x1, this.y1, this.x2, this.y2);
    }
}

class VerticalLine {
    constructor(id, x, y, maxX, maxY) {
        this.id = id;
        this.x1 = x;
        this.y1 = y;
        this.x2 = this.x1;
        this.maxX = maxX;
        this.maxY = maxY;
        this.init();
    }

    init() {
        this.z = random(0, 1);
        this.stepSize = map(this.z, 0, 1, 1, 10)
        this.len = map(this.z, 0, 1, 10, 200);
        this.y1 = 0 - this.len;
        this.y2 = 0;
        this.thickness = map(this.z, 0, 1, 0.5, 5);
    }

    update() {
        this.y1 = this.y1 + this.stepSize;
        this.y2 = this.y1 + this.len;
        if (this.y1 > this.maxY) {
           this.init();
        }
    }

    draw() {
        stroke(240);
        strokeWeight(this.thickness);
        strokeCap(SQUARE);
        line(this.x1, this.y1, this.x2, this.y2);
    }
}