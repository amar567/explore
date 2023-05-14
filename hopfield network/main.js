
let w;
let columns;
let rows;
let board;
let next;
let ImgVector;
let WeightMatrix;
let evolve = false;
// let evolve = true;

function setup() {
  // Set simulation framerate to 10 to avoid flickering
  frameRate(60);
  createCanvas(640, 640);
  w = 40;
  // Calculate columns and rows
  columns = floor(width / w);
  rows = floor(height / w);
  // Wacky way to make a 2D array is JS
  board = new Array(columns);
  for (let i = 0; i < columns; i++) {
    board[i] = new Array(rows);
  }
  // Going to use multiple 2D arrays and swap them
  next = new Array(columns);
  for (i = 0; i < columns; i++) {
    next[i] = new Array(rows);
  }
  init();
}

function toggle(i, j) {
  if (i <= columns & j <= rows) {
    board[i][j] = ((board[i][j]) == 1) ? -1 : 1
  }
}

function touchStarted(event) {
  let i = Math.floor(event.clientX / w)
  let j = Math.floor(event.clientY / w)
  toggle(i, j)
}
// describe('no image displayed');

function draw() {
  background(255);
  if (evolve) {
    evolveNetwork()
    updatePlot()
  }
  // generate();
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      if ((board[i][j] == 1)) fill(0);
      else fill(255);
      // fill(255);
      stroke(0);
      rect(i * w, j * w, w - 1, w - 1);
    }
  }
}

// reset board when mouse is pressed
function reset() {
  init();
}

// Fill board randomly
function init() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      board[i][j] = -1;
      next[i][j] = -1;
    }
  }


  ImgVector = imgToVector(board)
  // console.log(ImgVector);
  learnHebbianWeights(ImgVector);
}

function randInput() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      // fill the board randomly
      board[i][j] = (floor(random(2)) == 1) ? 1 : -1
      next[i][j] = -1;
    }
  }
  // console.log(board);
}

function imgToVector(arrayOfArrays) {

  let ImgArray = []

  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      ImgArray.push(arrayOfArrays[i][j])
    }
  }

  return (ImgArray)
}

function vectorToImg(imageVector) {

  // console.log(imageVector);
  let ImgArray
  ImgArray = new Array(columns);
  for (i = 0; i < columns; i++) {
    ImgArray[i] = new Array(rows);
  }

  // console.log(ImgArray);

  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      let n = i * rows + j
      ImgArray[i][j] = imageVector[n]
    }
  }

  return (ImgArray)
}

// hebbian learning

function learnHebbianWeights(imgVctr) {

  let length = imgVctr.length;

  WeightMatrix = new Array(length);
  for (i = 0; i < length; i++) {
    WeightMatrix[i] = new Array(length);
  }


  for (let i = 0; i < imgVctr.length; i++) {
    for (let j = 0; j < imgVctr.length; j++) {
      WeightMatrix[i][j] = imgVctr[i] * imgVctr[j]
    }
  }

  // console.log(WeightMatrix);

}

// after learning pattern we give a random input and let the system evolve

function checkThresholdForActivation(index, imageVector, WeightMatrix) {

  let summation = 0
  for (let i = 0; i < imageVector.length; i++) {
    summation += WeightMatrix[index][i] * imageVector[i]
    // console.log(WeightMatrix[index][i]*imageVector[i]);
  }

  summation -= WeightMatrix[index][index] * imageVector[index]
  // console.log(summation);

  if (summation >= 0) {
    return (1)
  } else {
    return (-1)
  }
}

function calculateEnergy() {

  // console.log(ImgVector);
  // console.log(WeightMatrix);

  let imgVctr = imgToVector(board)

  let summation = 0
  for (let i = 0; i < imgVctr.length; i++) {
    for (let j = 0; j < imgVctr.length; j++) {
      // console.log(WeightMatrix[i][j] * imgVctr[i] * imgVctr[j]);
      summation += WeightMatrix[i][j] * imgVctr[i] * imgVctr[j]
    }
    // console.log(summation);
  }
  // console.log(summation);
  let energy = -(1 / 2) * summation

  return energy
}

function evolveNetwork() {
  // Loop through every spot in our 2D array and check spots neighbors
  // make a next
  // image to vector
  let newVector = imgToVector(board)
  let randomIndex = floor(random(256))
  // console.log(randomIndex);

  let initial = newVector[randomIndex]

  newVector[randomIndex] = checkThresholdForActivation(randomIndex, newVector, WeightMatrix)
  // console.log(newVector[randomIndex]);

  // console.log(initial==newVector[randomIndex]);

  next = vectorToImg(newVector)

  board = next;

}


function learn() {
  ImgVector = imgToVector(board)
  // console.log(ImgVector);
  learnHebbianWeights(ImgVector);
}

function clearcanvas() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      // fill the board randomly
      board[i][j] = -1;
      next[i][j] = -1;
    }
  }
}

function fillrandom() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      // fill the board randomly
      board[i][j] = (floor(random(2)) == 1) ? 1 : -1
    }
  }
}

function startStop(params) {
  evolve = !evolve
  if (evolve) {
    document.getElementById("startStopBtn").innerHTML = `Stop`
  } else {
    document.getElementById("startStopBtn").innerHTML = `Start`
  }
}



Plotly.newPlot('myDiv', [{
  y: [0],
  mode: 'lines',
  width: 800,
  height: 600,
  bargap: 0.05,
  line: { color: '#80CAF6' }
}],
  {
    yaxis: { title: 'Energy' },
    xsaxis: { title: 'Frame No.' }
  });

function rand() {
  return Math.random();
}

// let va = (flock)=>{
//   let sum = createVector(0,0)
//   for (let i = 0; i < flock.length; i++) {
//       sum.add(flock[i].velocity)        
//   }
//   let v_a = Math.sqrt(sum.x**2,sum.y**2)
//   return Math.round(v_a*10000000000000/(N*SPEED))/10000000000000
// }

let updatePlot = () => {
  let E = calculateEnergy()
  Plotly.extendTraces('myDiv', {
    y: [[E]]
  }, [0])
  // console.log(E);
  // return E
}

//   setInterval(updatePlot(flock),100) // flock is an array in render.js