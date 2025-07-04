// Dapr hat cam
// Marc Duiker, Mar 2025
// @marcduiker

let video;
const desiredFrameRate = 15;
let bodyPose;
let head;
let poses = [];
let connections;
const minWidth = 1080;
const desiredRatio = 16/9;
const ml5Confidence = 0.1;
let scaledWidth;
let scaledHeight;
let oldleftEyeX = 0;
let oldleftEyeY = 0;
let oldrightEyeX = 0;
let oldrightEyeY = 0;
let oldMidX = 0;
let oldMidY = 0;
let hatData = [
    { 
        name: 'images/hat_blue.png',
        pointName: 'images/blue_1.png',
        points: 1,
        hatImage: null,
        pointImage: null
    },
    {
        name: 'images/hat_green.png',
        pointName: 'images/green_2.png',
        points: 2,
        hatImage: null,
        pointImage: null
    },
    {
        name: 'images/hat_purple.png',
        pointName: 'images/purple_3.png',
        points: 3,
        hatImage: null,
        pointImage: null
    },
    {
        name: 'images/hat_red.png',
        pointName: 'images/red_4.png',
        points: 4,
        hatImage: null,
        pointImage: null
    },
    {
        name: 'images/hat_orange.png',
        pointName: 'images/orange_5.png',
        points: 5,
        hatImage: null,
        pointImage: null
    },
    {
        name: 'images/hat_yellow.png',
        pointName: 'images/yellow_6.png',
        points: 6,
        hatImage: null,
        pointImage: null
    }
];
let hatArray = [];
let hatPerSecond = 0.5;
let maxVisibleHats = 5;
let score;
let font;
let isFinished;
let isModelReady;
let isStart;
let countDown;
let glassesImage;

function preload() {
    bodyPose = ml5.bodyPose(options = {enableSmoothing: true, flipped: true });
    font = loadFont('SpaceGrotesk-VariableFont_wght.ttf');
    glassesImage = loadImage('images/glasses_border.png');
    hatData.forEach(hat => {
        let hatImg = loadImage(hat.name)
        hat.hatImage = hatImg;
        let pointImg = loadImage(hat.pointName);
        hat.pointImage = pointImg;
    });
}

function setup() {
    frameRate(desiredFrameRate);
    let constraints = {
        video: {
          mandatory: {
            minWidth: minWidth,
            aspectRatio: desiredRatio
          },
          optional: [{minFrameRate: desiredFrameRate}]
        },
        flipped:true,
        audio: false
      };
    video = createCapture(constraints);
    reset();
}

function reset() {
    // select('#status').show();
    isFinished = false;
    isModelReady = false;
    isStart = false;
    poses = null;
    scaledWidth = windowWidth;
    scaledHeight = scaledWidth / desiredRatio;
    video.size(scaledWidth, scaledHeight);
    video.hide();
    bodyPose.detectStart(video, gotPoses);
    connections = bodyPose.getSkeleton();
    pixelDensity(1);
    let canv = createCanvas(scaledWidth, scaledHeight);
    canv.parent('sketch');
    countDown = new CountDown();
    score = new Score();
    head = new Head();
    hatArray = [];
    for (let i = 0; i < maxVisibleHats; i++) {
        hatArray.push(new Hat());
    }
}

function windowResized() {
    reset();
}

function gotPoses(results) {
    // Store the model's results in a global variable
    poses = results;
    isModelReady = true;
}

function draw() {
    
    background(100);
    image(video, 0, 0, scaledWidth, scaledHeight);
    if (isModelReady) {
        if (isStart) {
            hatArray.forEach(hat => {
                hat.update(head);
                hat.draw();
            });
            score.updateTime();
            score.draw();
        }
        else {
            countDown.update();
            countDown.draw();
        }
        drawPose();
    }
    if (isFinished) {
        saveImage();
        noLoop();
    }
}

function drawPose() {
    if (poses == null) return;
    poses.forEach(
        pose => {
            if (pose.left_eye.confidence > ml5Confidence && pose.right_eye.confidence > ml5Confidence) {
                let leftEyeX = pose.left_eye.x;
                let leftEyeY = pose.left_eye.y;

                let rightEyeX = pose.right_eye.x;
                let rightEyeY = pose.right_eye.y;

                const midX = rightEyeX + (leftEyeX - rightEyeX) / 2;
                const midY = rightEyeY + (leftEyeY - rightEyeY) / 2;

                let eyeDist = dist(leftEyeX, leftEyeY, rightEyeX, rightEyeY);
                // Calculate the angle of the head tilt bassed on the eye positions
                let headTilt = atan2(rightEyeY - leftEyeY, rightEyeX - leftEyeX);
                 
                // let threshold = 15;
                // if (Math.abs(midX - oldMidX) > threshold || Math.abs(midY - oldMidY) > threshold) {
                //     eyeDist = dist(leftEyeX, leftEyeY, rightEyeX, rightEyeY);
                //     oldleftEyeX = leftEyeX;
                //     oldleftEyeY = leftEyeY;
                //     oldrightEyeX = rightEyeX;
                //     oldrightEyeY = rightEyeY;
                //     oldMidX = midX;
                //     oldMidY = midY;
                // } else {
                //     // reuse old values
                //     eyeDist = dist(oldleftEyeX, oldleftEyeY, oldrightEyeX, oldrightEyeY);
                //     leftEyeX = oldleftEyeX;
                //     leftEyeY = oldleftEyeY;
                //     rightEyeX = oldrightEyeX;
                //     rightEyeY = oldrightEyeY;
                // }

                push();
                head.update(midX, midY, eyeDist, headTilt);
                head.draw();
                pop();
            }
        });
}

function mouseClicked() {
    if (!isFinished) {
        clickVector = createVector(mouseX, mouseY);
        hatArray.forEach(hat => {
            let distance = clickVector.dist(hat.vector);
            if (distance < hat.hatData.hatImage.width * hat.scale / 2 && !hat.isCollected) {
                hat.collect();
                score.updateScore(hat.hatData.points, 1);
            }
        });
    }
}

function keyPressed() {
    if (key === 'r' || key === 'R') {
        location.reload();
    } else if (key === 's' || key === 'S') {
        saveImage();
    }
}

function saveImage() {
    let currentDate = new Date();
    saveCanvas(`${currentDate.toISOString().replace(/:/g, '-')}-collect-the-hats`, 'jpg');
}

class Head {
    constructor() {
        this.x = null;
        this.y = null;
        this.rScaling = 3;
        this.glassesScaling = 3;
        this.glassesImage = glassesImage;
    }

    update(midX, midY, eyeDistance, headTilt) {
        this.x = midX;
        this.y = midY;
        this.headTilt = headTilt;
        this.radius = eyeDistance * this.rScaling;
        if (isFinished) {
            this.glassesWidth = eyeDistance * this.glassesScaling;
            this.glassesX = this.x - (this.glassesWidth) / 2;
            this.glassesHeight = this.glassesWidth * this.glassesImage.height / this.glassesImage.width;
            this.glassesY  = this.y - (this.glassesHeight) / 2;
        }
    }

    draw() {
        if (this.x !== null && this.y !== null) {
            noFill();
            stroke('#ffc825');
            strokeWeight(2);
            circle(this.x, this.y, this.radius);

            if (isFinished) {
                push();
                translate(this.glassesX, this.glassesY);
                rotate(this.headTilt);
                image(this.glassesImage, 0, 0, this.glassesWidth, this.glassesHeight);
                pop();
            }
        }
    }
}

class Hat {
    constructor() {
        this.reset();
    }

    reset() {
        this.chooseHat();
        this.image = this.hatData.hatImage;
        this.scale = 1.5;
        this.minX = this.image.width * this.scale;
        this.maxX = scaledWidth - this.image.width * this.scale;
        this.startHeight = -this.image.height * this.scale * random(1, 3);
        let newX = this.setNewX();
        this.vector = createVector(newX, this.startHeight);
        this.minSpeed = scaledHeight / 200;
        this.maxSpeed = scaledHeight / 100;
        let mappedSpeed = map(this.hatData.points, 1, 6, this.minSpeed, this.maxSpeed);
        let speedMult = map(score.countDown, score.timeLimit, 0, 1, 5);
        this.speed = createVector(0, mappedSpeed * speedMult);
        this.angle = random(-0.15, 0.15);
        this.isCollected = false;
        this.collectedTime = 0;
    }

    setNewX() {
        const maxIterations = 7;
        const minDistance = this.image.width;
        let newX;
        for (let i = 0; i < maxIterations; i++) {
            let smallestDistance = scaledWidth;
            newX = random(this.minX, this.maxX);
            hatArray.forEach(hat => {
                let hatDistance = abs(newX - hat.getX());
                //console.log(newX, hat.getX(), hatDistance, minDistance);
                if (hat !== this && hatDistance < smallestDistance) {
                    smallestDistance = hatDistance;
                }
            });
            if (smallestDistance > minDistance) {
                break;
            }
        }
        return newX; // Fallback value
    }

    getX() {
        return this.vector.x;
    }

    chooseHat() {
        let indices = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 2, 2, 3, 4, 5];
        let rndIndex = random(indices);
        this.hatData = hatData[rndIndex];
    }

    update(head) {
        this.vector = this.vector.add(this.speed);
        if (this.isCollected && millis() - this.collectedTime >= 700) {
            this.reset();
        }
        if (this.vector.y > scaledHeight + this.image.height * this.scale) {
            this.reset();
        }

        if (this.isIntersect(head)) {
            this.collect();
            score.updateScore(this.hatData.points, 1);
        }
    }

    isIntersect(head) {
        if (this.isCollected) return false;
        let hatWidth = this.hatData.hatImage.width * this.scale;
        let hatHeight = this.hatData.hatImage.height * this.scale;
        let headRadius = head.radius / 2; // Use half radius for better collision detection
        
        let rectLeft = this.vector.x - hatWidth / 2;
        let rectRight = this.vector.x + hatWidth / 2;
        let rectTop = this.vector.y - hatHeight / 2;
        let rectBottom = this.vector.y + hatHeight / 2;
        
        let closestX = constrain(head.x, rectLeft, rectRight);
        let closestY = constrain(head.y, rectTop, rectBottom);
        
        let distanceX = head.x - closestX;
        let distanceY = head.y - closestY;
        let distanceSquared = distanceX * distanceX + distanceY * distanceY;
        
        return distanceSquared <= (headRadius * headRadius);
    }

    collect() {
        this.scale = 1.5;
        this.speed = createVector(0, 0);
        this.isCollected = true;
        this.image = this.hatData.pointImage;
        this.collectedTime = millis();
    }

    draw() {
        const scaledW = this.image.width * this.scale;
        const scaledH = this.image.height * this.scale;
        push();
        translate(this.vector.x - scaledW / 2, this.vector.y - scaledH / 2);
        rotate(this.angle);
        image(this.image, 0, 0, scaledW, scaledH);
        pop();
    }
}

class CountDown {
    constructor() {
        this.limit = 5;
        this.startTime = millis();
        this.x = scaledWidth / 2;
        this.y = scaledHeight / 2;
        this.message = 'Get ready to catch the hats with your head!';
    }

    update() {
        const elapsedTime = millis() - this.startTime;
        if (elapsedTime >= 1000) {
            this.limit--;
            this.startTime = millis();
        }
        if (this.limit <= 0) {
            isStart = true;
            score.start();
        }
    }

    draw() {
        // Circle with countdown limit
        noStroke();
        textSize(100);
        textFont(font);
        textAlign(CENTER, CENTER);

        fill('#ffc825');
        noStroke(255);
        strokeWeight(5);
        circle(this.x, this.y, scaledWidth / 7);

        fill(0);
        noStroke();
        
        text(this.limit, this.x, this.y / 1.05);
        
        // Message
        let pad = 5;
        textSize(50);
        let bbox = font.textBounds(this.message, this.x, this.y / 3);
        fill('#ffc825');
        stroke(255);
        strokeWeight(5);
        rect(bbox.x - pad * 2, bbox.y - pad * 1.5, bbox.w + pad * 5, bbox.h + pad * 2.5);
        
        fill(0);
        noStroke();
        text(this.message, this.x, this.y / 3);
    }
}

class Score {
    constructor() {
        this.points = 0
        this.hatsCollected = 0;
        this.startTime = null;
        this.elapsedTime = 0;
        this.timeLimit = 30;
        this.countDown = this.timeLimit;
        this.pointsX = 30;
        this.pointsY = scaledHeight - 40;
        this.timeX = scaledWidth - 150
        this.timeY = scaledHeight - 40;
        this.pointsMessage = `Score: ${this.points} points, ${this.hatsCollected} hats`;
        this.timeMessage = `Time: ${this.countDown}`;
    }
    start() {
        this.startTime = millis();
    }

    updateTime() {
        if (this.startTime === null) return;
        const elapsedTime = millis() - this.startTime;
        if (elapsedTime > 1000) {
            this.elapsedTime += Math.floor(elapsedTime / 1000);
            this.startTime = millis();
            this.countDown = this.timeLimit - this.elapsedTime;
        }
        if (this.countDown <= 0) {
            isFinished = true;
        }
        this.timeMessage = `Time: ${this.countDown}`;
    }

    updateScore(points, hats) {
        this.points += points;
        this.hatsCollected += hats;
        this.pointsMessage = `Score: ${this.points} points, ${this.hatsCollected} hats`;
    }

    draw() {
        noStroke();
        textSize(32);
        textFont(font);
        textAlign(LEFT, CENTER);
        
        fill('#ffc825');
        stroke(255);
        strokeWeight(5);
        let pad = 5;
        let bboxPoints = font.textBounds(this.pointsMessage, this.pointsX, this.pointsY);
        rect(bboxPoints.x - pad, bboxPoints.y - pad * 1.5, bboxPoints.w + pad * 3, bboxPoints.h + pad * 2.5);
        let bboxTime = font.textBounds(this.timeMessage, this.timeX, this.timeY);
        rect(bboxTime.x - pad, bboxTime.y - pad * 1.5, bboxTime.w + pad * 3, bboxTime.h + pad * 2.5);
        
        fill(0);
        noStroke();
        text(this.pointsMessage, this.pointsX, this.pointsY);
        text(this.timeMessage, this.timeX, this.timeY);
    }
}