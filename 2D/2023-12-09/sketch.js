/// Space debris
/// Marc Duiker, @marcduiker, Dec 2023

let movingItems = [];
let clipItems = [];
let circleItems = [];
const numItems = 200;
const frameRateNr = 15;
const bgColor = 240;

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(frameRateNr);
    for (let i = 0; i < numItems; i++) {
        let x = 0;
        let y = random(0, windowHeight);
        movingItems.push(new HorizontalLine(i, x, y, windowWidth, windowHeight));
        circleItems.push(new CircleItem(i, windowWidth, windowHeight));
    }
}


function draw() {
    background(bgColor);
    movingItems.forEach(lineItem => {
        lineItem.update();
        lineItem.draw();
        circleItems.forEach(circleItem => {
            if (!lineItem.isHit && circleItem.checkCollision(lineItem)) {
                lineItem.hit();
            }
        });
    });

    circleItems.forEach(circleItem => {
        if (circleItem.isVisible) {
            circleItem.update();
            circleItem.draw();
        }
    });
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
        this.isHit = false;
        this.z = random(0, 1);
        this.stepSize = map(this.z, 0, 1, 1, 10)
        this.len = map(this.z, 0, 1, 10, 200);
        this.alpha = map(this.z, 0, 1, 0, 240);
        this.x1 = 0 - this.len;
        this.x2 = 0;
        this.thickness = map(this.z, 0, 1, 0.5, 5);
        this.color = color(0, this.alpha);
    }

    update() {
        this.x1 = this.x1 + this.stepSize;
        this.x2 = this.x1 + this.len;
        if (this.x1 > this.maxX) {
           this.init();
        }
    }

    hit() {
        this.isHit = true;
        this.color = color(255, 0, 0, this.alpha);
    }

    draw() {
        stroke(this.color);
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
        stroke(bgColor);
        strokeWeight(this.thickness);
        strokeCap(SQUARE);
        line(this.x1, this.y1, this.x2, this.y2);
    }
}

class CircleItem {
    constructor(id, maxX, maxY) {
        this.id = id;
        this.maxX = maxX;
        this.maxY = maxY;
        this.init();
    }

    init() {
        this.x = random(0, this.maxX);
        this.y = random(0, this.maxY);
        this.isVisible = false;
        this.updateCount = 0;
    }

    initCollision(line) {
        this.isVisible = true;
        this.z = line.z;
        this.startRadius = map(this.z, 0, 1, 1, 10);
        this.radius = this.startRadius;
        this.endRadius = map(this.z, 0, 1, 10, 200);
        this.stepSize = (this.endRadius - this.startRadius) / frameRateNr;
    }

    checkCollision(line) {
        let d = dist(this.x, this.y, line.x2, line.y2);
        if (d < 5) {
            this.initCollision(line);
            return true;
        }
        return false;
    }

    update() {
        if (this.radius <= this.endRadius) {
            this.radius = this.radius + this.stepSize;
        } else {
            this.init();
        }
        this.alpha = this.isVisible ? map(this.z, 0, 1, 0, 240) : 0;
    }

    draw() {
        stroke(color(255, 0, 0, this.alpha));
        strokeWeight(1);
        noFill();
        circle(this.x, this.y, this.radius);
    }
}