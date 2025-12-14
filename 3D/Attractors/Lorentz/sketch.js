let attractors;
const maxAttractors = 8;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(30);
  attractors = [];
  const deltaStart = 0.1;
  for (let i = 0; i < maxAttractors; i++) {
    let start = i * deltaStart + deltaStart;
    attractors.push(new Attractor(start, start, start));
  }
}

function draw() {
  background(10);
  orbitControl();
  scale(2);
  attractors.forEach(attractor => {
    attractor.update();
    attractor.draw();  
  });
}

class Attractor {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.sigma = 10; //10
    this.rho = 28; // 28
    this.beta = 8/3; // 8/3
    this.dx = 0;
    this.dy = 0;
    this.dz = 0;
    this.dt = 0.01;
    this.vectors = []
    this.maxVectors = 500;
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
    strokeWeight(1);
    
    for (let i = 1; i < this.vectors.length; i++) {
      let strokeAlpha = map(i, 1, this.vectors.length, 0, 255);
      stroke(255, strokeAlpha);
      this.prev = this.vectors[i-1];
      this.curr = this.vectors[i];
      point(this.curr.x, this.curr.y, this.curr.z);
      //line(this.prev.x, this.prev.y, this.prev.z, this.curr.x, this.curr.y, this.curr.z)
    }
  }
}