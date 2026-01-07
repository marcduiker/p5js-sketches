/// Genuary 2026 - Day 6: Lights on/off. Make something that changes when you switch on or off the “digital” lights.
/// Marc Duiker
/// https://marcduiker.dev
/// Jan 2026

let colors = blackwhite;
const fps = 24;
let state;
let bgColor, fgColor;
let doFill;
let windowW, windowH;
let isLeft;

async function setup() {
  frameRate(fps);
  init();
}

function init() {
  windowW = windowWidth;
  windowH = windowHeight;
  createCanvas(windowW, windowH);
  isLeft = window.screenX < 10;
  if (isLeft) {
    storeItem("state", true);
  } else {
    storeItem("state", false);
  }
  state = getItem("state");
  if (isLeft && state) {
    bgColor = colors[0];
    fgColor = colors[1];
  } else {
    bgColor = colors[1];
    fgColor = colors[0];
  }
  doFill = false;
}

function draw() {
  
  state = getItem("state");
  if ((isLeft && state) || (!isLeft && !state)) {
    bgColor = colors[0];
    fgColor = colors[1];
  }
  if ((!isLeft && state) || (isLeft && !state)) {
    bgColor = colors[1];
    fgColor = colors[0];
  }
  //background(bgColor);
  background(applyAlphaToColor(bgColor, 25));
  if (getItem("doFill")) {
    fill(fgColor);
    noStroke();
  } else {
    noFill();
    stroke(fgColor);
    strokeWeight(2);
  }
  
  let x = getItem("mouseX");
  let y = getItem("mouseY");
  circle(x, y, 100);
  //textSize(20);
  //text(`Mouse: (${x}, ${y})`, 10, height - 10);
}


function applyAlphaToColor(col, alpha) {
    let c = color(col);
    return color(red(c), green(c), blue(c), alpha);
  }

function mouseMoved() {
  storeItem("mouseX", mouseX);
  storeItem("mouseY", mouseY);
  storeItem("bgColor", bgColor);
  storeItem("fgColor", fgColor);
}

function mousePressed() {
  doFill = !doFill;
  storeItem("doFill", doFill);
  storeItem("state", !state);
  if (bgColor === colors[0]) {
    bgColor = colors[1];
    fgColor = colors[0];
  } else {
    bgColor = colors[0];
    fgColor = colors[1];
  }
}

function keyPressed() {
  console.log('key pressed', key);
  if (key === 's') {
    let timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    saveGif(`${timestamp}-genuary-5`, 180, { units: 'frames'} );
  }
  return;
}

function windowResized() {
  init();
}

