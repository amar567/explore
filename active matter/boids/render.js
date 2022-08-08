const flock = [];

var url_string = window.location.href
var url = new URL(url_string);

// let alignSlider, cohesionSlider, separationSlider;
let NUMBER_of_BOIDS = url.searchParams.get("N")|| 300 //N
let SPEED = url.searchParams.get("v")|| 5 // v
let PERCEPTION_RADIUS = url.searchParams.get("L")|| 25  // L
let DELTA_THETA_MAX = url.searchParams.get("eta")|| 0.1 // η
let PI = Math.round(Math.PI*10000)/10000

function setup() {
  createCanvas(window.innerWidth,window.innerHeight);
  // alignSlider = createSlider(0, 2, 1, 0.1);
  // cohesionSlider = createSlider(0, 2, 1, 0.1);
  // separationSlider = createSlider(0, 2, 1, 0.1);
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
  for (let boid of temp) {
    boid.edges();
    boid.flock(temp);
    boid.update();
    boid.show();
  }
  
  // let fps = flock[1].theta;
  let fps = frameRate();
  textSize(30);
  fill(255);
  stroke(0);
  text(fps.toFixed(2), width - 100, 50);
  // console.log(frameRate());

  // call update plot function
  // updatePlot(flock)
}

setInterval(() => {
  updatePlot(flock)
}, 100);