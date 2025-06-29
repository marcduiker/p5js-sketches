// Dapr hat cam
// Marc Duiker, Mar 2025
// @marcduiker

let video;
const desiredFrameRate = 15;
let bodyPose;
let poses = [];
let connections;
const minWidth = 1080;
const desiredRatio = 16/9;
const ml5Confidence = 0.3;
let scaledWidth;
let scaledHeight;
let ratio;
const ratios = [1, 4/3, 3/2, 16/9];
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
let isFinished = false;

function preload() {
    //bodyPose = ml5.bodyPose(options = {enableSmoothing: true});
    font = loadFont('SpaceGrotesk-VariableFont_wght.ttf');
    hatData.forEach(hat => {
        let hatImg = loadImage(hat.name)
        hat.hatImage = hatImg;
        let pointImg = loadImage(hat.pointName);
        hat.pointImage = pointImg;
    });
}

function setup() {
    frameRate(desiredFrameRate);
    // let constraints = {
    //     video: {
    //       mandatory: {
    //         minWidth: minWidth,
    //         aspectRatio: desiredRatio
    //       },
    //       optional: [{minFrameRate: desiredFrameRate}]
    //     },
    //     audio: false
    //   };
    // video = createCapture(constraints);
    reset();
    
}

function reset() {
    // select('#status').show();
    // poses = null;
    // scaledWidth = windowWidth;
    // scaledHeight = scaledWidth / desiredRatio;
    // console.log(scaledWidth, scaledHeight);
    // video.size(scaledWidth, scaledHeight);
    // video.hide();
    // bodyPose.detectStart(video, gotPoses);
    // connections = bodyPose.getSkeleton();
    pixelDensity(1);
    scaledWidth = windowWidth;
    scaledHeight = windowHeight;
    let canv = createCanvas(scaledWidth, scaledHeight);
    canv.parent('sketch');
    for (let i = 0; i < maxVisibleHats; i++) {
        hatArray.push(new Hat());
    }
    score = new Score();
}

function windowResized() {
    reset();
}

function gotPoses(results) {
    // Store the model's results in a global variable
    poses = results;
    modelReady();
  }

function modelReady() {
    select('#status').hide();
}

function draw() {
    if (isFinished) {
        noLoop();
    }
    background(100);
    
    //image(video, 0, 0, scaledWidth, scaledHeight);
    hatArray.forEach(hat => {
        hat.update();
        hat.draw();
    });
    score.updateTime();
    score.draw();
    //drawLine();
    //drawText();
}

function drawText() {
    fill(255);
    noStroke();
    textFont('Space Grotesk');
    textSize(18);
    textAlign(LEFT, BOTTOM);
    text('Dapr: APIs for Building Secure and Reliable Microservices | dapr.io', 10, height - 10);
}

function drawLine() {
    if (poses == null) return;
    poses.forEach(
        pose => {
            if (pose.left_eye.confidence > ml5Confidence && pose.right_eye.confidence > ml5Confidence) {
                let leftEyeX = pose.left_eye.x;
                let leftEyeY = pose.left_eye.y;
                //ellipse(leftEyeX, leftEyeY, 10, 10);

                let rightEyeX = pose.right_eye.x;
                let rightEyeY = pose.right_eye.y;
                //ellipse(rightEyeX, rightEyeY, 10, 10);

                const midX = rightEyeX + (leftEyeX - rightEyeX) / 2;
                const midY = rightEyeY + (leftEyeY - rightEyeY) / 2;

                let threshold = 15;
                if (Math.abs(midX - oldMidX) > threshold || Math.abs(midY - oldMidY) > threshold) {
                    eyeDist = dist(leftEyeX, leftEyeY, rightEyeX, rightEyeY);
                    oldleftEyeX = leftEyeX;
                    oldleftEyeY = leftEyeY;
                    oldrightEyeX = rightEyeX;
                    oldrightEyeY = rightEyeY;
                    oldMidX = midX;
                    oldMidY = midY;
                } else {
                    // reuse old values
                    eyeDist = dist(oldleftEyeX, oldleftEyeY, oldrightEyeX, oldrightEyeY);
                    leftEyeX = oldleftEyeX;
                    leftEyeY = oldleftEyeY;
                    rightEyeX = oldrightEyeX;
                    rightEyeY = oldrightEyeY;
                }
                const minEyeDist = scaledWidth/100;
                const maxEyeDist = scaledWidth/10;
                const offsetH = map(eyeDist, minEyeDist, maxEyeDist, 1.2, 1.5);
                const scaledW = eyeDist * 3.5;
                const scaledH = eyeDist * 3.5 * imageH / imageW;

                push();
                translate(midX, midY);
                const angle = atan2(leftEyeY - rightEyeY, leftEyeX - rightEyeX);
                rotate(angle);
                image(daprImage, -scaledW / 2, -scaledH * offsetH, scaledW, scaledH);
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

class Hat {
    constructor() {
        this.reset();
    }

    reset() {
        this.hatData = random(hatData);
        this.image = this.hatData.hatImage;
        console.log(this.hatData);
        this.scale = 1.5;
        this.minX = this.image.width * this.scale;
        this.maxX = scaledWidth - this.image.width * this.scale;
        this.minSpeed = scaledHeight / 100;
        this.maxSpeed = scaledHeight / 50;
        this.startHeight = -this.image.height * this.scale * random(1, 2);
        this.vector = createVector(random(this.minX, this.maxX), this.startHeight);
        this.speed = createVector(0, random(this.minSpeed, this.maxSpeed));
        this.angle = random(-0.15, 0.15);
        this.isCollected = false;
        this.collectedTime = 0;
    }

    update() {
        this.vector = this.vector.add(this.speed);
        if (this.isCollected && millis() - this.collectedTime >= 700) {
            this.reset();
        }
        if (this.vector.y > scaledHeight + this.image.height * this.scale) {
            this.reset();
        }
    }

    collect() {
        this.scale = 1.7;
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

class Score {
    constructor() {
        this.points = 0
        this.hatsCollected = 0;
        this.startTime = millis();
        this.elapsedTime = 0;
        this.timeLimit = 60;
        this.countDown = this.timeLimit;
        this.pointsX = 30;
        this.pointsY = scaledHeight - 30;
        this.timeX = scaledWidth - 150
        this.timeY = scaledHeight - 30;
        this.pointsMessage = `Score: ${this.points} points, ${this.hatsCollected} hats`;
        this.timeMessage = `Time: ${this.countDown}`;
    }

    updateTime() {
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
        textAlign(LEFT);
        
        fill(50);
        let pad = 5;
        let bboxPoints = font.textBounds(this.pointsMessage, this.pointsX, this.pointsY);
        rect(bboxPoints.x - pad, bboxPoints.y - pad, bboxPoints.w + pad * 2, bboxPoints.h + pad * 2);
        let bboxTime = font.textBounds(this.timeMessage, this.timeX, this.timeY);
        rect(bboxTime.x - pad, bboxTime.y - pad, bboxTime.w + pad * 2, bboxTime.h + pad * 2);
        
        fill(255);
        text(this.pointsMessage, this.pointsX, this.pointsY);
        text(this.timeMessage, this.timeX, this.timeY);
    }
}