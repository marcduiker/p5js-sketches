// Timer created for Dapr Day Oct 2024
// Marc Duiker, @marcduiker

let timerSeconds;
let bgColor = '#3ea9f5';
let textToDisplay;
const startText = 'Dapr 1.15 Celebration is starting soon!'; //'Break time! ☕'; 
const timeUpText = 'Let\'s go! 🚀';

let logo;
let drawX = 0;
let drawY;
let deltaX = 1;
let buttonStart;
let buttonReset;
let elapsedSeconds = 0;
let intervalId;
let timeInput;
let isRunning = false;

const columns = 12;
let colWidth;
let images = [];
let elements = [];
const maxElements = 12;

const formatter = new Intl.NumberFormat('en-US', {
    minimumIntegerDigits: 2,
})

function preload() {
  logo = loadImage('dapr-stacked-white.png');
  images[0] = loadImage('images/workflow.svg');
  images[1] = loadImage('images/pub-sub.svg');
  images[2] = loadImage('images/service-invocation.svg');
  images[3] = loadImage('images/state-store.svg');
  images[4] = loadImage('images/secrets.svg');
  images[5] = loadImage('images/configuration.svg');
  images[6] = loadImage('images/actors.svg');
  images[7] = loadImage('images/jobs.svg');
  images[8] = loadImage('images/distributed-lock.svg');
  images[9] = loadImage('images/bindings.svg');
  images[10] = loadImage('images/cryptography.svg');
  images[11] = loadImage('images/middleware.svg');
}

function setup() {
  colWidth = windowWidth / columns;
  textToDisplay = startText;
  for (let x = 0; x < maxElements; x++) {
    let imgIndex = x % 12;
    elements.push(new Element(images[imgIndex], imgIndex));
  }
  minuteInput = createInput('2', 'number');  
  minuteInput.attribute('min', 0);
  minuteInput.attribute('max', 59);
  minuteInput.size(35);
  secondInput = createInput('0', 'number');
  secondInput.attribute('min', 0);
  secondInput.attribute('max', 59);
  secondInput.size(35);
  buttonStart = createButton('start');
  buttonStart.mousePressed(()=> {
    isRunning = !isRunning;
    
    if (isRunning) {
      buttonStart.elt.innerHTML = 'stop';
      startTimer();
    } else {
      buttonStart.elt.innerHTML = 'start';
      reset();
    }
  });
  buttonReset = createButton('reset');
  buttonReset.mousePressed(()=> {
    reset();
  });
}

function reset() {
  isRunning = false;
  stopTimer(0);
  textToDisplay = startText;
}

function stopTimer(seconds) {
  clearInterval(intervalId);
  if (seconds != undefined) elapsedSeconds=seconds;
}

function startTimer() {
  intervalId = setInterval(()=> {
    elapsedSeconds += 1;
  }, 1000);
}

function draw() {
  colWidth = windowWidth / columns;
  createCanvas(windowWidth, windowHeight);
  background(color(bgColor));
  minuteInput.position(20, windowHeight-70);
  secondInput.position(65, windowHeight-70);
  buttonStart.position(20, windowHeight-40);
  buttonReset.position(75, windowHeight-40);
  
  elements.forEach(element =>{
    element.update();
    element.draw();
  });
  
  if (isRunning) {
    minuteInput.hide();
    secondInput.hide();
  } else {
    minuteInput.show();
    secondInput.show();
  } 
  drawX = drawX += deltaX;
  if (drawX > windowWidth) {
    drawX = 0 - logo.width/10;
  }
  drawY = windowHeight/2.5 - (logo.height/10);
  
  image(logo, drawX, drawY, logo.width/10, logo.height/10);
  timerSeconds = int(minuteInput.value()) * 60 + int(secondInput.value());
  
  let countDownTotalSeconds = timerSeconds - elapsedSeconds;
  let countDownSeconds = countDownTotalSeconds % 60;
  let countDownMinutes = floor(countDownTotalSeconds / 60);
  let timeToDisplay;
  if (countDownTotalSeconds > 0) {
    timeToDisplay = `${formatter.format(countDownMinutes)}:${formatter.format(countDownSeconds)}`;
  } else {
    timeToDisplay = `00:00`;
    textToDisplay = timeUpText;
  }
  fill(250);
  textFont('Space Grotesk');
  let fSizeText = floor(windowWidth / 30);
  let fSizeTime = floor(windowWidth / 20);
  textSize(fSizeText);
  textAlign(CENTER);
  text(textToDisplay, windowWidth/2, windowHeight*4/5);
  textSize(fSizeTime);
  text(timeToDisplay, windowWidth/2, windowHeight*3/5);
}

class Element {
  constructor(img, i) {
    this.img = img;
    this.new = true;
    this.i = i;
    this.init();
  }
  
  init() {
    if (!this.new) {
      this.i = floor(random(0, 13));  
    }
    this.size = random(0.3,0.6);
    this.x = this.i * colWidth / this.size;
    this.y = random(-this.img.height / this.size, 0);
    this.deltaY = map(this.size, 0.3, 0.6, 1.2, 3);
    this.new = false;
  }
  
  update() {
    this.x = this.i * colWidth / this.size;
    if (this.y < windowHeight /this.size ) {
      this.y += this.deltaY;
    } else {
      this.init();
    }
    
  }
  
  draw() {
    push();
    scale(this.size);
    tint(255, 150);
    image(this.img, this.x, this.y);
    pop();
  }
}