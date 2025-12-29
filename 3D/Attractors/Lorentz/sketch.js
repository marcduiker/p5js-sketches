/// Lorentz Attractor
/// Marc Duiker
/// https://marcduiker.dev
/// Dec 2025

let attractors;
const maxAttractors = 32;
let colors = dreamhaze8;
let bgColor;
let cam;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(30);
  cam = createCamera();
  bgColor = colors[0];
  attractors = [];
  const deltaStart = 0.5;
  for (let i = 0; i < maxAttractors; i++) {
    let start = i * deltaStart + deltaStart;
    attractors.push(new Attractor(start, start, start));
  }
}

function draw() {
  background(bgColor);
  orbitControl();
  cam.setPosition(map(sin(frameCount * 0.01), -1, 1, -400, 400), map(cos(frameCount * 0.01), -1, 1, -200, 200), map(sin(frameCount * 0.02), -1, 1, 300, 700));
  cam.lookAt(0, 0, 0);
  setCamera(cam);
  scale(6);
  attractors.forEach(attractor => {
    attractor.update();
    attractor.draw();  
  });
}

function keyPressed() {
  if (key === 's') {
    saveGif('lorentz-attractor', 15);
  }
}

class Attractor {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.color = colors[floor(random(1, colors.length))];
    this.sigma = 10; //10
    this.rho = 28; // 28
    this.beta = 8/3; // 8/3
    this.dx = 0;
    this.dy = 0;
    this.dz = 0;
    this.dt = 0.0075;
    this.vectors = []
    this.maxVectors = 150;
    this.prev = null;
    this.curr = null;
    
  }
  
  update() {
    this.dx = (this.sigma * (this.y - this.x)) * this.dt;
    this.dy = (this.x * (this.rho - this.z) - this.y) * this.dt;
    this.dz = (this.x * this.y - this.beta * this.z) * this.dt;
    this.x += this.dx;
    this.y += this.dy;
    this.z += this.dz;
    
    
    let v = createVector(this.x, this.y, this.z);
    this.vectors.push(v);
    if (this.vectors.length > this.maxVectors) {
      this.vectors.shift();
    } 
  }
  
  draw() {
    beginShape();
    for (let i = 1; i < this.vectors.length; i++) {
      let strokeAlpha = map(i, 1, this.vectors.length, 0, 255);
      strokeWeight(1);
      this.prev = this.vectors[i - 1];
      this.curr = this.vectors[i];
      
      noFill();
      stroke(this.applyAlphaToColor(this.color, strokeAlpha));
      //line(this.prev.x, this.prev.y, this.prev.z, this.curr.x, this.curr.y, this.curr.z);
      vertex(this.curr.x, this.curr.y, this.curr.z);
      
    }
    endShape();

    strokeWeight(3);
    stroke(255);
    let endVector = this.vectors[this.vectors.length - 1];
    point(endVector.x, endVector.y, endVector.z);
  }

  applyAlphaToColor(col, alpha) {
    let c = color(col);
    return color(red(c), green(c), blue(c), alpha);
  }
}

