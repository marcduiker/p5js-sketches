/// Ransom note
/// Marc Duiker
/// https://marcduiker.dev
/// Dec 2025

let word;
let colors = blackwhite;
const minFontSize = 24;
const maxFontSize = 32;
let bgColor;
let fonts = [];
const textMessage = "Hello there, how are you?";

async function setup() {
  fonts.push(await loadFont('./assets/Aldrich-Regular.ttf'));
  fonts.push(await loadFont('./assets/AnonymousPro-Regular.ttf'));
  fonts.push(await loadFont('./assets/CourierPrime-Regular.ttf'));
  fonts.push(await loadFont('./assets/Jacquard12-Regular.ttf'));
  fonts.push(await loadFont('./assets/Jersey10-Regular.ttf'));
  fonts.push(await loadFont('./assets/SpaceGrotesk-VariableFont_wght.ttf'));
  fonts.push(await loadFont('./assets/SpecialElite-Regular.ttf'));
  fonts.push(await loadFont('./assets/StardosStencil-Regular.ttf'));
  fonts.push(await loadFont('./assets/SyneMono-Regular.ttf'));
  fonts.push(await loadFont('./assets/Zain-Regular.ttf'));

  //fonts = ["Aldrich", "Anonymous Pro", "Courier Prime", "Jacquard 12", "Jersey 10", "Space Grotesk", "Special Elite", "Stardos Stencil", "Syne Mono", "Zain"];
  createCanvas(windowWidth, windowHeight);
  frameRate(30);
  bgColor = colors[0];

  word = new Word(textMessage, windowWidth / 2 - textMessage.length * 16, windowHeight / 2);
}

function draw() {
  background(bgColor);
  word.update();
  word.draw();
}

function keyPressed() {
  if (key === 's') {
    saveGif('text-1', 15);
  }
}

class Word {
  constructor(word, x, y) {
    this.word = word;
    this.size = random(minFontSize, maxFontSize);
    this.x = x;
    this.y = y;
    this.letterIndex = 0;
    this.letters = [];
    this.createLetters();
  }

  createLetters() {
    for (let i = 0; i < this.word.length; i++) {
      let letter = this.word.charAt(i);
      let x = this.x + i * this.size * 1.3;
      let y = this.y;
      this.letters.push(new LetterObject(letter, this.size, x, y));
    }
  }

  update() {
    if (this.letters[this.letterIndex] === ' ') return;
    this.letters[this.letterIndex].update();
    this.letterIndex++;
    if (this.letterIndex >= this.letters.length) {
      this.letterIndex = 0;
    }
  }

  draw() {
    this.letters.forEach(letterObj => {
      if (letterObj.letter === ' ') return;
      letterObj.draw();
    });
  }
}

class LetterObject {
  constructor(letter, size, x, y) {
    this.letter = letter;
    this.size = size;
    this.origX = x;
    this.origY = y;
    this.x = x;
    this.y = y;
    this.color = colors[floor(random(0, colors.length))];
    this.fontObject = random(fonts);
    this.bbox = this.fontObject.textBounds(this.letter, this.x, this.y);
    this.borderPadding = this.size / 3;
  }
  
  update() {
    this.color = colors[floor(random(0, colors.length))];
    this.fontObject = random(fonts);
    this.y = this.origY + random(-this.size * 0.2, this.size * 0.2);
    this.bbox = this.fontObject.textBounds(this.letter, this.x, this.y);
  }
  
  draw() {
    if (this.color === colors[0]) {
      fill(colors[1])
    } else {
      noFill();
    }
    stroke('white');
    rect(this.bbox.x - this.borderPadding, this.bbox.y - this.borderPadding, this.bbox.w + this.borderPadding * 2, this.bbox.h + this.borderPadding * 2);
    fill(this.color);
    textFont(this.fontObject);
    textSize(this.size);
    text(this.letter, this.x, this.y);
  }

  applyAlphaToColor(col, alpha) {
    let c = color(col);
    return color(red(c), green(c), blue(c), alpha);
  }
}

