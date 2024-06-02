// Book presentation Fading Away
// Marc Duiker, June 2024
//

let screenW, screenH;
let pic1, pic2, pic3;
let black;
let ditherType = 'atkinson';

function preload() {
  pic1 = loadImage('img/1_600x900.jpg');
  pic2 = loadImage('img/2.jpg');
  pic3 = loadImage('img/3.png');
}

function setup() {
  pixelDensity(1);
  createCanvas(pic1.width, pic1.height);
  screenW = pic1.width;
  screenH = pic1.height;
  black = new Riso('black'); //create black layer
}

function draw() {
  background(255);
  let threshold = map(mouseX, 0, screenW, 0, 255); //change dither threshold with mouse position
  clearRiso();

  let dithered = ditherImage(pic1, ditherType, threshold);//pass image to dither
  black.image(dithered, 0, 0); //draw dithered image

  drawRiso();
}

function keyReleased() { //function to change dither type with a keypress
  if (key == 1) ditherType = 'atkinson';
  else if (key == 2) ditherType = 'floydsteinberg';
  else if (key == 3) ditherType = 'bayer';
  else if (key == 4) ditherType = 'none';
}