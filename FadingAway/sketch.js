// Book presentation Fading Away
// Marc Duiker, June 2024
//

let screenW, screenH;
let pic1, pic2, pic3;
let black;
let ditherType = 'atkinson';
let threshold;

let scenes = [];
let sceneIndex;
let sceneChange = false;
let frameEaseMax = 15;
let frameEaseCount;


function preload() {
  pic1 = loadImage('img/1_600x900.jpg');
  pic2 = loadImage('img/2.jpg');
  pic3 = loadImage('img/3.png');
}

function setup() {
  frameEaseCount = frameEaseMax;
  sceneIndex = 0;
  threshold = 0;
  frameRate(30);
  pixelDensity(1);
  screenW = windowWidth;
  screenH = windowHeight;
  createCanvas(screenW, screenH);
  pic1.resize(0, screenH);
  textFont('Times New Roman');
  textSize(24);
  threshold = 0;
  riso = new Riso('black'); //create black layer
  scenes[0]=['critical', 'unfair', 'vain', 'tyrant'];
  scenes[1]=['a doctor', 'a singer', 'a patriot', 'a politician', 'a voluntary firefighter', 'always on duty'];
  scenes[2]=['a believer in one God,', 'the Father Almighty'];
  scenes[3]=['always pulling up the handbreak', 'at each and every red light'];
  scenes[4]=['always ready to drive me to school', 'whenever I failed to wake up on time'];

}

function draw() {
  background(255);
  //let threshold = map(mouseX, 0, screenW, 0, 255); //change dither threshold with mouse position
  if (frameEaseCount < frameEaseMax) {
    const brightnessDelta = 1;
    pic1 = adjustBrightness(pic1, brightnessDelta, frameEaseCount);
    frameEaseCount++;
  }

  clearRiso();
  let dithered = ditherImage(pic1, ditherType, threshold);//pass image to dither
  riso.image(dithered, screenW - pic1.width, 0); //draw dithered image
  drawRiso();

  noStroke();
  fill('black');
  console.log(scenes.length);
  if (sceneIndex < scenes.length) {
    const currentText = scenes[sceneIndex][0];
    text(currentText, 100, 100);
  }
}

function adjustBrightness(pic, increase) {
  pic.loadPixels();
  for (let i = 0; i < pic.pixels.length; i += 4) {
    pic.pixels[i] = pic.pixels[i] + increase;
    pic.pixels[i + 1] = pic.pixels[i + 1] + increase;
    pic.pixels[i + 2] = pic.pixels[i + 2] + increase;
  }
  pic.updatePixels();
  return pic;
}

function keyReleased() {
  if (key == 'r') {
    location.reload();
  } else {
    sceneIndex++;
  }
  frameEaseCount = 0;
}