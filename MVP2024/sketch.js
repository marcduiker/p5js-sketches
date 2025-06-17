// MVP 2024-2025
// Marc Duiker
// marcduiker.dev

let disc;
let font;
let video;
let discArray = [];
const maxDiscs = 100;
const W = 1280;
const H= 720;
let mainDisc;
let fps = 30;
let opacity;
let context;

function preload() {
  disc = loadModel("/assets/mvp-disc.obj");
  font = loadFont("/assets/RobotoMono-Bold.ttf");
  video = createVideo("/assets/mvp-video-marcduiker.mp4");
}

function setup() {
  createCanvas(W, H, WEBGL);
  context = new Context();
  video.hide();
  frameRate(fps);
  randomSeed(89); //68, 72, 87, 89
  angleMode(DEGREES);
  mainDisc = new Disc(-1, 23, 45, 0, 0, true);
  discArray.push(mainDisc);
  for (let d = 0; d < maxDiscs; d++) {
    discArray.push(new Disc(d));
  }
  
  specularMaterial(255);
}

function draw() {
  //console.log(context);
  if (!context.isVideo()) {
    background(10);
  }
  
  if (context.isWireframeStart()) {
    //console.log(`Wireframe start: ${context.isWireframeStart()}`)
    context.globalFill = false;
  }
  
  if (context.isVideoStart()) {
    //console.log(`Video start: ${context.isVideoStart()}`);
    video.play();
  }
  
  if (context.isVideo()) {
    //console.log(`isVideo: ${context.isVideo()}`);
    image(video, -W/2, -H/2);
  }
  
  if (context.isVideoEnd()) {
    //console.log(`Video end: ${context.isVideoEnd()}`)
    context.reset();
  }
  
  orbitControl();
  ambientLight(10);
  directionalLight(255, 255, 255, 0, 1, 0); // from top
  directionalLight(100, 200, 255, 0, -1, 0); // from bottom
  directionalLight(100, 200, 255, -1, 0, 0); // from right
  directionalLight(255, 100, 200, 1, 0, 0); // from left
  discArray.forEach(d => {
    d.update();
    d.draw();  
  });
  context.incFrames();
}

class Disc {
  constructor(index, scale, rx, ry, rz, isMain) {
    this.index = index;
    this.isMain = isMain ?? false;
    this.endX = -140;
    this.endY = -44;
    this.endZ = 0;
    this.startX = -195;
    this.startY = -44;
    this.startZ = 0;
    this.stepSize = (this.endX - this.startX) / (fps * 2);
    this.x = this.isMain ? this.startX : random(-500, 500);
    this.y = this.isMain ? this.startY : random(-500, 500);
    this.z = this.isMain ? this.startZ : random(-500, 500);
    this.rz = rz ?? random(-10, 10);
    this.ry = ry ?? random (-10, 10);
    this.rx = rx ?? random(-90, 90);
    this.shininess = random(200, 250);
    this.metalness = random(100, 180);
    this.startRX = 90 + this.rx;
    this.startRY = -90 + this.ry;
    this.scale = scale ?? random(5, 15);
    this.fill = color(255);
    this.stroke = color(210);
    this.isFill = true;
    this.timerFill = 120;
    this.timerStroke = 30;
    
    this.angleInc = random(1, 2);
  }
  
  reset() {
    if (this.isMain) {
      this.x = this.startX;
      this.y = this.startY;
      this.z = this.startZ;
    }
  }
  
  update() {
    if (this.isMain && context.isVideoEnd()) {
      this.reset();
    }
    if (this.isMain && context.isVideo() && this.x < this.endX) {
      this.x += this.stepSize;
      this.y = this.endY;
      this.z = this.endZ;
    }
    if (!this.isMain) {
      this.rx += this.angleInc;
    }
      
    if (this.isMain) {
      this.isFill = false;
    } else {
      this.isFill = context.globalFill;  
    }
  }
  
  draw() {
    specularMaterial(255);
    shininess(this.shininess);
    metalness(this.metalness);
    
    if (this.isFill) {
      fill(this.fill);
      noStroke();
    } else {
      strokeWeight(0.5);
      stroke(this.stroke);
      noFill();
    }
  
    push();
      translate(this.x, this.y, this.z);
      rotateX(this.rx);
      scale(this.scale);
      rotateX(this.startRX);
      rotateY(this.startRY);
      if (this.isMain && context.isVideo()) {
        model(disc);
      } else if (!this.isMain && context.isWireframe()) {
        model(disc);
      } else if (!this.isMain && !context.isVideo()) {
        model(disc);
      }
    pop();
  }
}

class textRender {
  constructor() {
    this.isFill = false;
    this.textSize = 100;
  }
  
  draw(){
    if (!this.isFill) {
      fill(this.fill);
      textFont(font);
      textAlign(CENTER,CENTER);
      textSize(this.textSize);
      text('Marc Duiker', 0, -this.textSize);
      text('MVP 2024-2025', 0, this.textSize);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(10);
}

function keyPressed() {
  if (key === 's') {
    saveGif('mpv-disc_marc-duiker.gif', 318, {units: "frames"});
  }
}

class Context {
  constructor() {
    this.frames = 0;
    this.globalFill = true;
    this.frameCount3D = 0;
    this.frameCountWireframeStart = 120;
    this.frameCountWireframeEnd = 320;
    this.frameCountVideoStart = 180;
    this.frameCountVideoEnd = 320;
  }
  
  is3DStart() {
      return this.frames === this.frameCount3D;
  }
  
  isWireframeStart() {
      return this.frames === this.frameCountWireframeStart;
  }
  
  isWireframe() {
      return (this.frames >= this.frameCountWireframeStart && 
             this.frames < this.frameCountWireframeEnd);
  }
  
  isVideoStart() {
      return this.frames === this.frameCountVideoStart;
  }
  
  isVideo() {
    return (this.frames >= this.frameCountVideoStart && 
      this.frames < this.frameCountVideoEnd)
  }
  
  isVideoEnd() {
      return this.frames === this.frameCountVideoEnd;
  }
  
  incFrames() {
    this.frames+=1;
  }
  
  reset() {
    this.frames = 0;
    this.globalFill = true;
    video.stop();
    discArray[0].reset();
  }
}