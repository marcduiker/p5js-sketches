// Horizontal Lines
// Marc Duiker, @marcduiker, Aug 2022

let lines = [];
const maxLines = 10;
let maxWidth;
const lineColor = 20;
const bgColor = 220;

function setup() {
  frameRate(5);
  maxW = windowWidth;
  maxH = windowHeight;
  maxWidth = maxW / 8;
  createCanvas(maxW, maxH);
  for (i = 0; i < maxLines; i++) {
    lines.push(createSmallLine());
    lines.push(createSmallLine());
    lines.push(createMediumLine());
    lines.push(createMediumLine());
    lines.push(createMediumToLargeLine());
    lines.push(createLargeLine());
  }
  lines.push(createExtraLargeLine());
}

function createSmallLine() {
  return createRandomLine(random(1, maxWidth / 3));
}


function createMediumLine() {
  return createRandomLine(random(1, maxWidth / 2));
}

function createMediumToLargeLine() {
  return createRandomLine(random(1, maxWidth / 1.5));
}

function createLargeLine() {
  return createRandomLine(random(1, maxWidth));
}

function createExtraLargeLine() {
  return createRandomLine(random(maxWidth * 4, maxWidth * 5));
}

function createRandomLine(width) {
  const x1 = random(0, maxW);
  const y1 = random(0, maxH);

  return new Line(
    x1, y1, width, lineColor
  )
}

function draw() {
  background(bgColor);
  lines.forEach((line) => line.update());
  lines.forEach((line) => line.draw());
  loadPixels();
  for (let i = 0; i < pixels.length-4; i+=4) {
      let r = pixels[i];
      let g = pixels[i+1];
      let b = pixels[i+2];
      gray = getGrayScaleColor(r, g, b);
      const dither = gray > random(lineColor - 3, bgColor + 3) ? bgColor : lineColor;
      pixels[i] = dither;
      pixels[i+1] = dither;
      pixels[i+2] = dither;
  }
  updatePixels();
}

class Line {
  constructor(x1, y1, size, color) {
    this.x1 = x1;
    this.y1 = y1;
    this.size = size;
    this.x2 = this.x1 + size;
    this.y2 = y1;
    this.color = color;
  }

  update() {
    this.x1 += this.speed();
    this.x2 += this.speed();
    if (this.x1 > maxW) {
      this.x2 = 0;
      this.x1 = this.x2 - this.size;
      this.y1 = random(0, maxH);
      this.y2 = this.y1;
    }
  }

  opacity() {
    return map(this.size, 1, maxWidth, 80, 255);
  }

  thickness() {
    return map(this.size, 1, maxWidth, 0.5, 3);
  }

  speed() {
    return map(this.size, 1, maxWidth, 0.5, 3);
  }

  draw() {
    stroke(this.color, this.opacity());
    strokeWeight(this.thickness());
    strokeCap(SQUARE);
    line(this.x1, this.y2, this.x2, this.y2);
  }
}

function getGrayScaleColor(r, g, b) {
  // Gray scale based on linear luminance for each color channel:
  // https://en.wikipedia.org/wiki/Grayscale
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}