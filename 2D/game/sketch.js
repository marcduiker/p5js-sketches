// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


let video;
let poseNet;
let poses = [];
let daprImage;
const imageW = 600;
const imageH = 350;

function setup() {
  frameRate(5);
  createCanvas(640, 480);
  daprImage = loadImage('Dappy_1.gif'); 
  video = createCapture(VIDEO);
  video.size(width, height);

  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on('pose', function(results) {
    poses = results;
  });
  video.hide();
}

function modelReady() {
  select('#status').html('Model Loaded');
}

function draw() {
  image(video, 0, 0, width, height);
  drawLine();
}

function drawLine() {
  poses.forEach(
   pose => {
     //console.log(pose);
     if (pose.pose.leftEye.confidence > 0.9 & pose.pose.rightEye.confidence > 0.9) {
    const leftEyeX = pose.pose.leftEye.x;
    const leftEyeY = pose.pose.leftEye.y;
    const rightEyeX = pose.pose.rightEye.x;
    const rightEyeY = pose.pose.rightEye.y;
    const midX = rightEyeX + (leftEyeX - rightEyeX)/2;
    const midY = rightEyeY + (leftEyeY - rightEyeY)/2;
    
    const eyeDist = dist(leftEyeX, leftEyeY, rightEyeX, rightEyeY);
    console.log(leftEyeX, rightEyeX, eyeDist);
    const factor = map(eyeDist, 0, 100, 6, 1);
    const scaledW = imageW/factor;
    const scaledH = imageH/factor;
    //translate(midX-scaledW/2, midY-scaledH - 10*factor);
    // translate to the middle of the eyes
    translate(midX, midY);
    // rotate the image based on the left and right eye position
    const angle = atan2(leftEyeY - rightEyeY, leftEyeX - rightEyeX);
    rotate(angle);
    image(daprImage, 0, 0, scaledW, scaledH);
        




    // rotate the image based on the left and right eye position
    const angle = atan2(leftEyeY - rightEyeY, leftEyeX - rightEyeX);
    rotate(angle);
    image(daprImage, 0, 0, scaledW, scaledH);
    }
  });

}

// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(255, 0, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}
