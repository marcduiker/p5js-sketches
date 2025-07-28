// Video lines sketch
// Marc Duiker, 2025

let video;
const desiredFrameRate = 15;
let connections;
const minWidth = 1080;
const desiredRatio = 16/9;
let scaledWidth;
let scaledHeight;
let activePointPair = null;
let pointPairs = [];
let doUpdatePixels = false;

function setup() {
    reset();
}

function reset() {
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
    scaledWidth = windowWidth;
    scaledHeight = scaledWidth / desiredRatio;
    video.size(scaledWidth, scaledHeight);
    video.hide();
    pixelDensity(1);
    createCanvas(scaledWidth, scaledHeight);
    activePointPair = null;
    pointPairs = [];
}

function draw() {
  background(220);

  image(video, 0, 0, scaledWidth, scaledHeight);
  loadPixels();
 
  pointPairs.forEach(pair => {
    pair.drawPixels();
  });

  if (activePointPair != null) {
    if (activePointPair.doUpdatePixels) {
      activePointPair.drawPixels();
      newPair = activePointPair;
      pointPairs.push(newPair);
      activePointPair = null;
    } else {
      activePointPair.drawPoints();
      activePointPair.drawText();
    }
  }
  
}

function resetPoints() {
  
}

class PointPair {
    constructor(vector1) {
      this.v1 = vector1;
      this.v1Color = "lightgreen";
      this.v2 = null;
      this.v2Color = "red";
      this.v1v2Center = null;
      this.v1v2CenterColor = "blue";
      this.direction = null;
      this.pixels = [];
      this.doUpdatePixels = false;
    }

    setSecondVector(vector2) {
      this.v2 = vector2;
    }

    setThirdVector(vector3) {
      this.v3 = vector3;
    }

    getV1V2Center() {
      // Calculate the center point between v1 and v2
      if (this.v1 && this.v2) {
        return createVector(
          (this.v1.x + this.v2.x) / 2,
          (this.v1.y + this.v2.y) / 2
        );
      }
    }

    drawPoints() {
      noStroke();
      if (this.v1) {
        fill(this.v1Color);
        circle(this.v1.x, this.v1.y, 10);
      }
      if (this.v2) {
        fill(this.v2Color);
        circle(this.v2.x, this.v2.y, 10);
        this.v1v2Center = this.getV1V2Center();
        fill(this.v1v2CenterColor);
        circle(this.v1v2Center.x, this.v1v2Center.y, 10);
        stroke(0);
        strokeWeight(2);
        line(this.v1.x, this.v1.y, this.v2.x, this.v2.y);
      }
    }

    drawText() {
      noStroke();
      textSize(12);
      if (this.v1) {
        fill(this.v1Color);
        text(`(${round(this.v1.x)}, ${round(this.v1.y)})`, 20, 20);
      }
      if (this.v2) {
        fill(this.v2Color);
        text(`(${round(this.v2.x)}, ${round(this.v2.y)})`, 20, 40);
      }
    }

    drawPixels() {
      if (this.v1 && this.v2 && this.direction !== null) {
        let minX = Math.min(this.v1.x, this.v2.x);
        let maxX = Math.max(this.v1.x, this.v2.x);
        let minY = Math.min(this.v1.y, this.v2.y);
        let maxY = Math.max(this.v1.y, this.v2.y);
        let dx = maxX - minX; // 7 - 2 = 5
        let dy = maxY - minY; // 10 - 6 = 4
        let slopeYX = dy / dx; // 4 / 5 = 0.8
        let slopeXY = dx / dy; // 5 / 4 = 1.25

        if (this.direction === 0 || this.direction === 1) {
          for (let x = minX; x <= maxX; x+=0.5) {
            let y = slopeYX * (x - minX) + minY;
            let c = get(x, y);
            strokeWeight(1);
            stroke(c[0], c[1], c[2], c[3]);
            if (this.direction === 0) {
              line(x, y, x, 0);
            } else if (this.direction === 1) {
              line(x, y, x, scaledHeight);
            }
          }
        } else if (this.direction === 2 || this.direction === 3) {
          for (let y = minY; y <= maxY; y+=0.5) {
            let x = slopeXY * (y - minY) + minX;
            let c = get(x, y);
            strokeWeight(1);
            stroke(c[0], c[1], c[2], c[3]);
            if (this.direction === 2) {
              line(x, y, 0, y);
            } else if (this.direction === 3) {
              line(x, y, scaledWidth, y);
            }
          }
        }
      }

      // if (this.v1 && this.v2) {
      //   let x1 = Math.floor(this.v1.x);
      //   let y1 = Math.floor(this.v1.y);
      //   let x2 = Math.floor(this.v2.x);
      //   let y2 = Math.floor(this.v2.y);
        
      //   let dx = x2 - x1;
      //   let dy = y2 - y1;
      //   let steps = max(abs(dx), abs(dy));
        
      //   for (let i = 0; i <= steps; i++) {
      //     let t = i / steps;
      //     let x = Math.floor(x1 + t * dx);
      //     let y = Math.floor(y1 + t * dy);
          
      //     if (x >= 0 && x < scaledWidth && y >= 0 && y < scaledHeight) {
      //       let c = get(x, y);
      //       strokeWeight(1);
      //       stroke(c[0], c[1], c[2], c[3]);
      //       if (this.direction === 0) {
      //         line(x, y, x, 0);
      //       } else if (this.direction === 1) {
      //         line(x, y, x, scaledHeight);
      //       } else if (this.direction === 2) {
      //         line(x, y, 0, y);
      //       } else if (this.direction === 3) {
      //         line(x, y, scaledWidth, y);
      //       } 
      //     }
      //}
    }
}

function mouseClicked() {
  if (activePointPair == null) {
    activePointPair = new PointPair(createVector(mouseX, mouseY));
  } else if (activePointPair.v2 == null) {
    activePointPair.setSecondVector(createVector(mouseX, mouseY));
  }
}

function keyPressed() {
  if (key === 'r' || key === 'R') {
    reset();
  } else if ((key === 'u' || key === 'U') && activePointPair.direction !== null) {
    activePointPair.doUpdatePixels = !activePointPair.doUpdatePixels;
  } else if (key === 's' || key === 'S') {
    saveCanvas('screenshot', 'png');
  } else if (keyCode === UP_ARROW) {
    activePointPair.direction = 0; // Up
  } else if (keyCode === DOWN_ARROW) {
    activePointPair.direction = 1; // Down
  } else if (keyCode === LEFT_ARROW) {
    activePointPair.direction = 2; // Left
  } else if (keyCode === RIGHT_ARROW) {
    activePointPair.direction = 3; // Right
  }
}
