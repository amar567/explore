let w, columns, rows, board, next, ImgVector, WeightMatrix, nOfImgs;// initialize some global variables
let evolve = false;
let ypos = 0;
let xpos = 0;
let selectedIndex = null;
let isDrawing = null;
let frameTime = null

// setup the p5 canvas 640x640 px where each pixel/neuron will be 40px wide 40px tall
function setup() {
  // Set simulation framerate to 10 to avoid flickering
  frameRate(100);
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

window.addEventListener("scroll", (event) => {
  ypos = this.scrollY;
  xpos = this.scrollX;
});

// toggle the state of neuron by clicking
function toggle(i, j) {
  if (i < columns & j < rows) {
    board[i][j] = ((board[i][j]) == 1) ? -1 : 1
  }
}


function touchStarted(event) {
  let i = Math.floor((event.clientX + xpos) / w)
  let j = Math.floor((event.clientY + ypos) / w)
  toggle(i, j)
}

function draw() {
  background(255);
  if (evolve) {
    evolveNetwork()
    updatePlot()
  }
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      if ((board[i][j] == 1)) fill(0);
      else fill(255);
      ((i * rows + j) === selectedIndex) ? stroke(0, 255, 0) : stroke(50);
      ((i * rows + j) === selectedIndex) ? strokeWeight(4) : strokeWeight(1);
      rect(i * w, j * w, w - 1, w - 1);
    }
  }

  document.getElementById("fr").innerHTML = `Current frame rate: ${Math.round(1000/(Date.now() - frameTime))}`

  frameTime = Date.now()

}

// reset board when mouse is pressed
function reset() {
  (evolve) ? startStop() : null
  selectedIndex = null
  Plotly.deleteTraces("myDiv", 0);
  init();
}

// Fill board randomly
function init() {
  plotme()
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      board[i][j] = -1;
      next[i][j] = -1;
    }
  }

  // we initialize the weight matrix because someone can press the start button in the beginning
  ImgVector = imgToVector(board)
  let length = ImgVector.length;

  // initialize weight matrix
  WeightMatrix = new Array(length);
  for (i = 0; i < length; i++) {
    WeightMatrix[i] = new Array(length);
  }

  // learn blank weights
  learnHebbianWeights(ImgVector);
  nOfImgs = 0
  memoryList.innerHTML = `
  `

  // Add the event listeners for mousedown, mousemove, and mouseup

  let canvasElement = document.getElementById("defaultCanvas0");


  canvasElement.addEventListener("mousedown", (e) => {
    isDrawing = true;
  });

  canvasElement.addEventListener("mousemove", (e) => {
    if (isDrawing) {
      let i = Math.floor((e.clientX + xpos) / w)
      let j = Math.floor((e.clientY + ypos) / w)
      board[i][j] = 1
    }
  });

  window.addEventListener("mouseup", (e) => {
    if (isDrawing) {
      isDrawing = false;
    }
  });
}

function randInput() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      // fill the board randomly
      board[i][j] = (floor(random(2)) == 1) ? 1 : -1
      next[i][j] = -1;
    }
  }
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

  let ImgArray
  ImgArray = new Array(columns);
  for (i = 0; i < columns; i++) {
    ImgArray[i] = new Array(rows);
  }


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

  document.getElementById("memoryList").innerHTML = ""

  // update learned list
  updateLearnedList()

  // this will reset the previous weight matrix
  nOfImgs = 0

  for (let i = 0; i < imgVctr.length; i++) {
    for (let j = 0; j < imgVctr.length; j++) {
      WeightMatrix[i][j] = imgVctr[i] * imgVctr[j]
    }
  }

}

// after learning pattern we give a random input and let the system evolve

function checkThresholdForActivation(index, imageVector, WeightMatrix) {

  let summation = 0
  for (let i = 0; i < imageVector.length; i++) {
    summation += WeightMatrix[index][i] * imageVector[i]
  }

  summation -= WeightMatrix[index][index] * imageVector[index]

  if (summation >= 0) {
    return (1)
  } else {
    return (-1)
  }
}

function calculateEnergy() {


  let imgVctr = imgToVector(board)

  let summation = 0
  for (let i = 0; i < imgVctr.length; i++) {
    for (let j = 0; j < imgVctr.length; j++) {
      summation += WeightMatrix[i][j] * imgVctr[i] * imgVctr[j]
    }
  }
  let energy = -(1 / 2) * summation

  return energy
}

function evolveNetwork() {
  // Loop through every spot in our 2D array and check spots neighbors
  // make a next
  // image to vector
  let newVector = imgToVector(board)
  let randomIndex = floor(random(newVector.length))
  selectedIndex = randomIndex

  let initial = newVector[randomIndex]

  newVector[randomIndex] = checkThresholdForActivation(randomIndex, newVector, WeightMatrix)


  next = vectorToImg(newVector)

  board = next;

}

function updateLearnedList() {
  // get the element
  let memoryList = document.getElementById("memoryList")

  // get image's base64 data
  let currentCanvas = document.getElementById("defaultCanvas0")
  let context = currentCanvas.getContext("2d")
  let canvasData = currentCanvas.toDataURL()
  let data = canvasData.image

  memoryList.innerHTML += `
    <img src="${canvasData}" style="width: 100px;margin:6px;">
  `
}

function learn() {
  ImgVector = imgToVector(board)
  learnHebbianWeights(ImgVector);
}

function stackImg() {

  imgVctr = imgToVector(board)

  updateLearnedList()

  for (let i = 0; i < imgVctr.length; i++) {
    for (let j = 0; j < imgVctr.length; j++) {
      newWeight = imgVctr[i] * imgVctr[j]
      WeightMatrix[i][j] = (WeightMatrix[i][j] * nOfImgs + newWeight) / (nOfImgs + 1)
    }
  }


  nOfImgs += 1
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

function startStop() {
  evolve = !evolve
  if (evolve) {
    document.getElementById("startStopBtn").innerHTML = `Stop`
  } else {
    document.getElementById("startStopBtn").innerHTML = `Start`
  }
}



function plotme() {

  Plotly.newPlot('myDiv', [{
    y: [0],
    mode: 'lines',
    width: 800,
    height: 800,
    bargap: 0.05,
    line: { color: '#80CAF6' }
  }],
    {
      title: {
        text: 'Energy vs Time',
        font: {
          family: 'Courier New, monospace',
          size: 24
        }
      },
      xaxis: {
        title: {
          text: 'Epoch',
          font: {
            family: 'Courier New, monospace',
            size: 18,
            color: '#7f7f7f'
          }
        }
      },
      yaxis: {
        title: {
          text: 'Energy',
          font: {
            family: 'Courier New, monospace',
            size: 18,
            color: '#7f7f7f'
          }
        }
      }
    });

}

let updatePlot = () => {
  let E = calculateEnergy()
  Plotly.extendTraces('myDiv', {
    y: [[E]]
  }, [0])
}