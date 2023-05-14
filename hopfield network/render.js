const flock = [];
let epoch = 0

var url_string = window.location.href
var url = new URL(url_string);

// let alignSlider, cohesionSlider, separationSlider;
let NUMBER_of_BOIDS = url.searchParams.get("N")|| 500 //N
let SPEED = url.searchParams.get("v")|| 5 // v
let PERCEPTION_RADIUS = url.searchParams.get("L")|| 25  // L
let DELTA_THETA_MAX = url.searchParams.get("eta")|| 0.1 // η
let PI = Math.round(Math.PI*10000)/10000
let SideLength = 500

function setup() {
  createCanvas(1000,1000);
  for (let i = 0; i < NUMBER_of_BOIDS; i++) {
    flock.push(new Boid());
  }
}

function drawArrow(base, vec, myColor) {
  push();
  stroke(myColor);
  strokeWeight(3);
  fill(myColor);
  translate(base.x, base.y);
  line(0, 0, vec.x, vec.y);
  rotate(vec.heading());
  let arrowSize = 7;
  translate(vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}

function draw() {
  background(51);
  let temp = flock
  for (let boid of flock) {
    boid.edges();
    boid.flock(temp);
    boid.update();
    boid.show();
  }
  epoch +=1
  
  updatePlot(flock);
  
  // let fps = epoch;
  // let fps = updatePlot(flock);
  let fps = frameRate();
  textSize(30);
  fill(255);
  stroke(0);
  text(fps.toFixed(2), width - 100, 50);
}

// setInterval(() => {
//   updatePlot(flock)
// }, 100);