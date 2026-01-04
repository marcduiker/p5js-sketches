/// Genuary 2026 - Day 1: One Color, one shape
/// Marc Duiker
/// https://marcduiker.dev
/// Jan 2026

let word;
let colors = blackwhite;
let maxFontSize;
const fps = 5;
let bgColor;
let fonts = [];
let letterObj;
let windowW, windowH;

async function setup() {
  fonts.push(await loadFont('./assets/Arial.ttf'));
  fonts.push(await loadFont('./assets/Arial Bold.ttf'));
  fonts.push(await loadFont('./assets/Arial Italic.ttf'));
  fonts.push(await loadFont('./assets/Times New Roman.ttf'));
  fonts.push(await loadFont('./assets/Times New Roman Bold.ttf'));
  fonts.push(await loadFont('./assets/Times New Roman Italic.ttf'));
  fonts.push(await loadFont('./assets/AmericanTypewriter.ttc'));
  fonts.push(await loadFont('./assets/Caskaydia Cove NF.otf'));
  fonts.push(await loadFont('./assets/Caskaydia Cove NF Bold.otf'));
  fonts.push(await loadFont('./assets/Caskaydia Cove NF Italic.otf'));
  frameRate(fps);
  init();
}

function init() {
  windowW = 700;
  windowH = 700;
  createCanvas(windowW, windowH);
  maxFontSize = windowW * 0.9;
  letterObj = new LetterObject('1');
  bgColor = colors[0];
}

function draw() {
  background(bgColor);
  if (frameCount % 10 === 0) {
    letterObj.update();
  }
  letterObj.draw();
}

function keyPressed() {
  if (key === 's') {
    let timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    saveGif(`${timestamp}-genuary-1`, 20);
  }
}

class LetterObject {
  constructor(letter) {
    this.letter = letter;
    this.init();
  }

  init() {
    this.size = maxFontSize;
    this.x = windowW / 2;
    this.y = windowH / 2;
    this.color = colors[1];
    this.fontObject = random(fonts);
    textSize(this.size);
    this.points = this.fontObject.textToPoints(this.letter, this.x, this.y, this.size, { sampleFactor: 0.05 });
  }
  
  update() {
    this.init();
  }
  
  draw() {
    fill(this.color);
    noStroke();
    //textFont(this.fontObject);
    //textAlign(CENTER, CENTER);
    this.points.forEach(point => {
      textSize(maxFontSize * 0.03);
      let xrand = random(-2, 2);
      let yrand = random(-2, 2);
      textFont(random(fonts));
      textAlign(CENTER, CENTER);
      text(this.letter, point.x + xrand, point.y + yrand);
    });
  }

  applyAlphaToColor(col, alpha) {
    let c = color(col);
    return color(red(c), green(c), blue(c), alpha);
  }
}

function windowResized() {
  init();
}

