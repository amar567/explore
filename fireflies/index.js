let FLY_COUNT = 250;
let FLY_SPEED = 0;
let BLINK_FREQUENCY = 0.7;
let TIME_SPEED_FACTOR = 1;  // how fast time passes [ multiplication factor ]
let FIELD_OF_VISION = 300;
let COUPLING_CONSTANT = 0.00001

// initialize the flies

fly_array = [];

for (let i = 0; i < FLY_COUNT; i++) { 

    fly_array.push(
        new Fly(
            Math.random() * window.innerWidth, 
            Math.random() * window.innerHeight, 
            Math.random() * FLY_SPEED,
            Math.random() * 0.3,
            Math.random() * 360, 
            Math.random() > 0.5,
            Math.random() * 360
        )
    );
}

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
}

let cycle_timeStamp = new Date().getTime();

function draw() {
    // set the scene
    background(0);

    // find the new quad tree
    fly_array = quadTree(fly_array);

    // update the flies
    for (let fly of fly_array) {
        fly.update(fly_array);
        fly.show();
    }
    // console.log(fly_array);

    // render cycle speed
    let cycle_speed = new Date().getTime() - cycle_timeStamp;
    let fps = Math.trunc(1000 / cycle_speed);
    textSize(16);
    fill(255, 255, 255, 255);
    text(fps, 10, 16);

    cycle_timeStamp = new Date().getTime();
}