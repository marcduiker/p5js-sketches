/// Genuary 2026 - Day 5: Write “Genuary”. Avoid using a font.
/// Marc Duiker
/// https://marcduiker.dev
/// Jan 2026

let word;
let colors = blackwhite;
const fps = 24;
let bgColor;
let windowW, windowH;
let letters;
let doStart;

async function setup() {
  frameRate(fps);
  init();
}

function init() {
  doStart = false;
  windowW = 800;
  windowH = 800;
  gridSize = 15;
  createCanvas(windowW, windowH);
  bgColor = colors[0];
  let size = 80;
  let padding = 20;
  letters = [
    // G
    new Letter("G", size, -3 * size - 3 * padding, 
      [
        new Shape(0, -windowH / 2, 0, size, colors[1]),
        new Shape(size * 2/8, 0, 0, size * 6/8, colors[0]),
        new Shape(size * 2/8, windowH / 2, size * 1/8, size * 3/8, colors[1])
      ]
    ),
    // E
    new Letter("E", size, -2 * size - 2 * padding,
      [
        new Shape(0, windowH / 2, 0, size, colors[1]),
        new Shape(size * 2/8, 0, 0, size * 6/8, colors[0]),
        new Shape(size * 1/8, -windowH / 2, 0, size * 3/8, colors[1]),
      ]
    ),
    // N
    new Letter("N", size, -1 * size - 1 * padding,
      [
        new Shape(0, -windowH / 2, 0, size, colors[1]),
        new Shape(0, size * 2/8, size * 2/8, size * 6/8, colors[0]),
      ]
    ),
    // U
    new Letter("U", size, 0 * size + 0 * padding,
      [
        new Shape(0, windowH / 2, 0, size, colors[1]),
        new Shape(0, -size * 2/8, -size * 2/8, size * 6/8, colors[0]),
      ]
    ),
    // A
    new Letter("A", size, 1 * size + 1 * padding,
      [
        new Shape(0, -windowH / 2, 0, size, colors[1]),
        new Shape(0, size * 2/8, size * 2/8, size * 6/8, colors[0]),
        new Shape(0, windowH / 2, size * 1/8, size * 3/8, colors[1]),
      ]
    ),
    // R
    new Letter("R", size, 2 * size + 2 * padding,
      [
        new Shape(0, windowH / 2, 0, size, colors[1]),
        new Shape(size * 2/8, 0, 0, size * 6/8, colors[0]),
        new Shape(size * 2/8, -windowH / 2, -size * 1/8, size * 3/8, colors[1]),
      ]
    ),
    // Y
    new Letter("Y", size, 3 * size + 3 * padding,
      [
        new Shape(0, -windowH / 2, 0, size, colors[1]),
        new Shape(0, -size * 2/8, -size * 2/8, size * 6/8, colors[0]),
        new Shape(0, windowH / 2, size * 6/8, size * 3/8, colors[1]),
      ]
    ),
  ];
}

function draw() {
  background(applyAlphaToColor(bgColor, 25));
  if (doStart) {
    push();
    translate(windowW / 2, windowH / 2);
    letters.forEach(letter => {
      letter.update();
      letter.draw();
    });
    pop();
  }
}

class Letter {
  constructor(letter, size, offset, shapes) {
    this.init(letter, size, offset, shapes);
  }

  init(letter, size, offset, shapes) {
    this.letter = letter;
    this.size = size;
    this.offset = offset;
    this.shapes = shapes;
  }

  update() {
    this.shapes.forEach(shape => {
      shape.update();
    });
  }

  draw() {
    push();
    translate(this.offset, 0);
    this.shapes.forEach(shape => {
      shape.draw();
    });
    pop();
  }
}


class Shape {
  constructor(x, yi, yf, r, c) {
    this.x = x;
    this.y = yi;
    this.yi = yi;
    this.yf = yf;
    this.r = r;
    this.c = c;
    this.deltaY = 5;
  }

  update() {
    if (this.yi < this.yf) {
      this.y += this.deltaY;
    } else if (this.yi > this.yf) {
      this.y -= this.deltaY;
    }
    
    if (this.yi < this.yf && this.y >= this.yf) {
      this.y = this.yf;
    }
    if (this.yi > this.yf && this.y <= this.yf) {
      this.y = this.yf;
    }
  }
  
  draw() {
    fill(this.c);
    noStroke();
    circle(this.x, this.y, this.r);
  }
}

function applyAlphaToColor(col, alpha) {
    let c = color(col);
    return color(red(c), green(c), blue(c), alpha);
  }

function keyPressed() {
  console.log('key pressed', key);
  if (key === 's') {
    doStart = true;
    let timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    saveGif(`${timestamp}-genuary-5`, 180, { units: 'frames'} );
  }
  return;
}

function windowResized() {
  init();
}

