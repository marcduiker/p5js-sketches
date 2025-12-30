/// Ransom notes
/// Marc Duiker
/// https://marcduiker.dev
/// Dec 2025

let word;
let colors = blackwhite;
const minFontSize = 24;
const maxFontSize = 48;
const fps = 15;
let bgColor;
let fonts = [];
let texts = [];
let messages = [];
let isComplete;

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
  bgColor = colors[0];
  texts.push('01234 56789');
  texts.push('987 6543210');
  texts.push('.;!<(#$>?*.');
  texts.forEach((msg, index) => {
    messages.push(new Message(msg, index, texts.length - 1));
  });
}

function draw() {
  background(bgColor);
  
  messages.forEach(message => {
    message.update();
    message.draw();
    if (message.isComplete) {
      isComplete = message.isComplete;
      return;
    }
  });
  if (isComplete) {
    messages.forEach(message => {
      message.updateRow();
    });
    isComplete = false;
  }

  // Determines when the final message has been shown
  // and the messages should cycle from the beginning.
  if (messages[messages.length-1].row === -1) {
    messages.forEach(message => {
      message.resetRow();
    });
  }
}

function keyPressed() {
  if (key === 's') {
    let timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    saveGif(`${timestamp}-ransom-notes`, 15);
  }
}

class Message {
  constructor(message, index, maxIndex) {
    this.word = message;
    this.index = index;
    this.maxIndex = maxIndex;
    this.row = index;
    this.size = maxFontSize;
    this.x = windowWidth / 2 - (this.word.length * this.size) / 2;
    if (this.row === 0) {
      this.initRow0();
    }
  }

  initRow0() {
    this.isComplete = false;
    this.y = windowHeight / 2;
    this.letterIndex = 0;
    this.letters = [];
    this.createLetters();
  }

  resetRow() {
    this.row = this.index;
  }

  createLetters() {
    for (let i = 0; i < this.word.length; i++) {
      let letter = this.word.charAt(i);
      let x = this.x + i * this.size * 1.1;
      let y = this.y;
      this.letters.push(new LetterObject(letter, x, y));
    }
  }

  // Row numbers per iteration
  // Iteration 1   2   3
  //           ---------
  //           0  -1  -2
  //           1   0  -1
  //           2   1   0
  updateRow() {
    this.row--;
    this.isComplete = false;
    if (this.row === 0) {
      this.initRow0();
    }
  }

  update() {
    if (this.row === 0) {
      if (this.letters[this.letterIndex] === ' ') return;
      if (floor(frameCount % (fps / 8)) === 0) {
        this.letters[this.letterIndex].update();
        this.letterIndex++;
        if (this.letterIndex >= this.letters.length) {
          this.isComplete = true;
          this.letterIndex = 0;
        }
      }
    }
  }

  draw() {
    if (this.row === 0) {
      this.letters.forEach(letterObj => {
        if (letterObj.letter === ' ') return;
        letterObj.draw();
      });
    }
  }
}

class LetterObject {
  constructor(letter, x, y) {
    this.letter = letter;
    this.origX = x;
    this.origY = y;
    this.x = x;
    this.y = y;
    this.init();
  }

  init() {
    this.size = random(minFontSize, maxFontSize);
    this.color = colors[floor(random(0, colors.length))];
    this.fontObject = random(fonts);
    this.y = this.origY + random(-this.size * 0.2, this.size * 0.2);
    textSize(this.size);
    this.bbox = this.fontObject.textBounds(this.letter, this.x, this.y);
    this.borderPadding = this.size / 2.5;
  }
  
  update() {
    this.init();
  }
  
  draw() {
    // background box
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
    //textAlign(CENTER);
    text(this.letter, this.x, this.y);
  }

  applyAlphaToColor(col, alpha) {
    let c = color(col);
    return color(red(c), green(c), blue(c), alpha);
  }
}

