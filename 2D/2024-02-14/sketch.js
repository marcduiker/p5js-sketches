// Valentines day
// Marc Duiker
// @marcduiker, Feb 14th 2024

const w=400;
const h=400;
const tDelta=0.01;
let t=0;
let t1=1;
let hearts = [];

function setup() {
  createCanvas(w, h); 
  for (let i=0; i < 50; i++){
    hearts.push(new Heart());  
  }
}

function draw() {
  background(10, 10);
  hearts.forEach(heart =>{  
    heart.draw();
  });
}

class Heart {
  constructor() {
    this.centerX = random(0, w);
    this.centerY = random(0, h);
    this.size = 0.2;
  }
  
  draw() {
    const centerW = this.centerX;
    const centerH = this.centerY;
    const midH = -h/6;
  
    push();
    translate(centerW, centerH);
    scale(noise(t) * this.size);
    const v1 = createVector(0, centerH);
    const v2 = createVector(-w/2, midH);
    const v3 = createVector(w/2, midH);
    const v4 = createVector(-w/4, midH);
    const v5 = createVector(w/4, midH);
    const v6 = createVector(w/2, h*2/3);

    noStroke();
    beginShape();
    arc(v4.x, v4.y, v6.x, v6.y, PI, PI*2);
    arc(v5.x, v5.y, v6.x, v6.y, PI, PI*2);
    vertex(v1.x, v1.y);
    vertex(v2.x, v2.y);
    vertex(v3.x, v3.y);
    endShape();
    pop();
    t+=tDelta;
  }
    
}



{
    "resourceId" : "my_file_name",
    "lockOwner" : "random_id_abc123",
    "expiryInSeconds": 60
}
