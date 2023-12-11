/// Space debris
/// Marc Duiker, @marcduiker, Dec 2023

let spaceShips = [];
let debrisItems = [];
const numSpaceShips = 250;
const numDebrisItems = 400;
const frameRateNr = 15;
const bgColor = 240;

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(frameRateNr);
    for (let i = 0; i < numSpaceShips; i++) {
        spaceShips.push(new SpaceShip(i, windowWidth, windowHeight));
    }

    for (let i = 0; i < numDebrisItems; i++) {
        debrisItems.push(new DebrisItem(i, windowWidth, windowHeight));
    }
}


function draw() {
    background(bgColor);

    debrisItems.forEach(debrisItem => {
        debrisItem.draw();
    });

    spaceShips.forEach(lineItem => {
        lineItem.update();
        lineItem.draw();
        debrisItems.forEach(debrisItem => {
            if (!lineItem.isHit && debrisItem.checkCollision(lineItem)) {
                lineItem.hit();
            }
        });
    });

    debrisItems.forEach(debrisItem => {
        debrisItem.update();
        debrisItem.draw();
        if (debrisItem.explosionItem.isVisible) {
            debrisItem.explosionItem.update();
            debrisItem.explosionItem.draw();
        }
    });
}


class SpaceShip {
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

class DebrisItem {
    constructor(id, maxX, maxY) {
        this.id = id;
        this.maxX = maxX;
        this.maxY = maxY;
        this.init();
    }

    init() {
        this.x = random(0, this.maxX);
        this.y = random(0, this.maxY);
        this.explosionItem = new ExplosionItem(this.id, this.x, this.y); 
        this.z = random(0, 1);
        this.size = map(this.z, 0, 1, 1, 10);
        this.alpha = map(this.z, 0, 1, 0, 240);
        this.color = color(0, 0, 255, this.alpha);
    } 

    checkCollision(line) {
        let dxy = dist(this.x, this.y, line.x2, line.y2);
        let dz = abs(this.z - line.z);
        if (dxy < 2 & dz < 0.2) {
            this.explosionItem.initCollision(line);
            this.color = color(255, 0, 0, this.alpha);
            return true;
        }
        return false;
    }

    update() {
        this.x = this.x + (random(- 0.5, 0.5));
        this.y = this.y + (random(- 0.5, 0.5));
        this.explosionItem.x = this.x;
        this.explosionItem.y = this.y;
    }

    draw() {
        rectMode(RADIUS);
        stroke(this.color);
        strokeWeight(1);
        noFill();
        rect(this.x, this.y, this.size);
    }
}

class ExplosionItem {
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.init();
    }

    init() {
        this.isVisible = false;
    }

    initCollision(line) {
        this.color = color(255, 0, 0);
        this.isVisible = true;
        this.z = line.z;
        this.startRadius = map(this.z, 0, 1, 1, 10);
        this.radius = this.startRadius;
        this.endRadius = map(this.z, 0, 1, 10, 200);
        this.stepSize = (this.endRadius - this.startRadius) / (frameRateNr * 2);
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