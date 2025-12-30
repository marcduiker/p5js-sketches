/// Ransom notes
/// Marc Duiker
/// https://marcduiker.dev
/// Dec 2025

let word;
let colors = blackwhite;
const minFontSize = 48;
const maxFontSize = 64;
const fontSizeMultiplier = 1.1;
const fps = 30;
let bgColor;
let fonts = [];
let messageText = "social media is holding you hostage, they don't want your money, they want your attention.";
let message;
let step;

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

  createCanvas(windowWidth, windowHeight);
  frameRate(fps);
  let nrOfPaddingChars = ceil((windowWidth / 2) / maxFontSize * fontSizeMultiplier);
  messageText += ' '.repeat(nrOfPaddingChars);
  bgColor = colors[0];
  step = 0;
  message = new Message(messageText);
}

function draw() {
  background(bgColor);
  message.update(step);
  message.draw(step);
  if (floor(frameCount % (fps / 4)) === 0) {
    step++;
  }
  if (step > message.length) {
    step = 0;
  }
}

function keyPressed() {
  if (key === 's') {
    let timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    saveGif(`${timestamp}-ransom-notes`, 15);
  }
}

class Message {
  constructor(message) {
    this.message = message;
    this.length = this.message.length;
    this.size = maxFontSize;
    this.init();
  }

  init() {
    this.isComplete = false;
    this.letterIndex = 0;
    this.letters = [];
    this.createLetters();
  }

  createLetters() {
    for (let i = 0; i < this.length; i++) {
      let letter = this.message.charAt(i);
      this.letters.push(new LetterObject(letter, i));
    }
  }

  update(step) {
    for (let i = 0; i < step; i++) {
      if (this.letters[i].letter === ' ') continue;
      this.letters[i].update(step);
    }
  }

  draw(step) {
    for (let i = 0; i < step; i++) {
      if (this.letters[i].letter === ' ') continue;
      this.letters[i].draw();
    }
  }
}

class LetterObject {
  constructor(letter, index) {
    this.letter = letter;
    this.index = index;
    this.init();
  }

  init() {
    this.size = random(minFontSize, maxFontSize);
    this.y = windowHeight / 2 + random(-this.size * 0.2, this.size * 0.2);
    this.color = colors[floor(random(0, colors.length))];
    this.fontObject = random(fonts);
  }
  
  update(step) {
    this.x = windowWidth / 2 - (step - this.index) * maxFontSize * fontSizeMultiplier;
    textSize(this.size);
    this.bbox = this.fontObject.textBounds(this.letter, this.x, this.y);
    this.borderPadding = this.size / 2.5;
  }
  
  draw() {
    // background box
    if (!this.bbox) return;
    if (this.color === colors[0]) {
      fill(colors[1]);
      stroke(colors[0]);
    } else {
      fill(colors[0])
      stroke(colors[1]);
    }
    
    rect(this.bbox.x - this.borderPadding, this.bbox.y - this.borderPadding, this.bbox.w + this.borderPadding * 2, this.bbox.h + this.borderPadding * 2);
    // text
    fill(this.color);
    textFont(this.fontObject);
    textSize(this.size);
    text(this.letter, this.x, this.y);
    //circle(this.x, this.y, this.size);
  }

  applyAlphaToColor(col, alpha) {
    let c = color(col);
    return color(red(c), green(c), blue(c), alpha);
  }
}

