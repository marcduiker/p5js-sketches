/// Midi Control
/// Marc Duiker, @marcduiker, May 2023

let xSlider;
let ySlider;
let zSlider;
let rSlider;
let gSlider;
let bSlider;
let angleSlider;
let rotationAngle = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(30);
    setupMidi();
    xSlider = createSlider(0, 127, 127);
    xSlider.position(20, 20);
    ySlider = createSlider(0, 127, 60);
    ySlider.position(20, 40);
    zSlider = createSlider(0, 127, 0);
    zSlider.position(20, 60);

    rSlider = createSlider(0, 127, 0);
    rSlider.position(160, 20);
    gSlider = createSlider(0, 127, 0);
    gSlider.position(160, 40);
    bSlider = createSlider(0, 127, 0);
    bSlider.position(160, 60);
    
    angleSlider = createSlider(0, 127, 64);
    angleSlider.position(300, 20);
    
}

function setupMidi() {
    navigator.requestMIDIAccess().then((midiAccess) => {
        Array.from(midiAccess.inputs).forEach((input) => {
            // Change the input index for the MIDI device you want to use
            input[1].onmidimessage = (msg) => {
                handleMidiMessage(msg);
            };
        });
    });
}

function handleMidiMessage(msg) {
    switch (msg.data[1]) {
        case 1:
            xSlider.value(msg.data[2]);
            break;
        case 2:
            ySlider.value(msg.data[2]);
            break;
        case 3:
            zSlider.value(msg.data[2]);
            break;
        case 4:
            rSlider.value(msg.data[2]);
            break;
        case 5:
            gSlider.value(msg.data[2]);
            break;
        case 6:
            bSlider.value(msg.data[2]);
            break;
        case 7:
            angleSlider.value(msg.data[2]);
            break;
        default:
            break;
    }
    console.log(msg);
}

function draw() {
    background(220);
    stroke(getColor());
    let lineLength = getLength();
    
    strokeWeight(map(ySlider.value(), 0, 127, 1, 20));
    translate(windowWidth / 2, windowHeight / 2);
    rotate(map(rotationAngle, 0, 127, 0, TWO_PI));
    // draw a line that rotates around its center
    let x1 = -lineLength / 2;
    let y1 = 0;
    let x2 = lineLength / 2;
    let y2 = 0;
    line(x1, y1, x2, y2);
    drawStructure(x1, y1, x2, y2, lineLength, 20);

    rotationAngle += map(zSlider.value(), 0, 127, 0.1, 5);
}

function drawStructure(x1, y1, x2, y2, lineLength, segment) {
    translate(x2, y2);
    scale(0.8);
    rotate(getAngle());
    line(x1, y1, x2, y2);
    segment--;
    if (segment > 0) {
        drawStructure(x1, y1, x2, y2, lineLength, segment);
    }
}

function getLength() {
    return map(xSlider.value(), 0, 127, 0, windowWidth * 0.7);
}

function getAngle() {
    return map(angleSlider.value(), 0, 127, -PI, PI);
}

function getColor() {
    return color(
        map(rSlider.value(), 0, 127, 0, 255),
        map(gSlider.value(), 0, 127, 0, 255),
        map(bSlider.value(), 0, 127, 0, 255)
    );
}