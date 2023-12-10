/// Space debris
/// Marc Duiker, @marcduiker, Dec 2023

let movingItems = [];
let circleItems = [];
const numMovingItems = 200;
const numCircleItems = 200;
const frameRateNr = 30;
const bgColor = 240;

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(frameRateNr);
    for (let i = 0; i < numMovingItems; i++) {
        movingItems.push(new HorizontalLine(i, windowWidth, windowHeight));
    }

    for (let i = 0; i < numCircleItems; i++) {
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
    constructor(id, maxX, maxY) {
        this.id = id;
        this.maxX = maxX;
        this.maxY = maxY;
        this.init();
    }

    init() {
        this.isHit = false;
        this.x1 = 0;
        this.y1 = random(0, this.maxY);
        this.y2 = this.y1;
        this.z = random(0, 1);
        this.stepSize = map(this.z, 0, 1, 1, 5)
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
        this.stepSize = (this.endRadius - this.startRadius) / (frameRateNr * 2);
    }

    checkCollision(line) {
        let d = dist(this.x, this.y, line.x2, line.y2);
        if (d < 2) {
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
        stroke(color(0, this.alpha));
        fill(0, this.alpha);
        circle(this.x, this.y, this.radius / 5);
    }
}