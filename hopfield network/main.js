// Global variables
let w, columns, rows, board, next, ImgVector, WeightMatrix, nOfImgs;
let evolve = false;
let ypos = 0;
let xpos = 0;
let selectedIndex = null;
let isDrawing = null;
let frameTime = null;
let frameNo = null;
let lastframeNo = 0;
let lastframeTime = 0;

function setup() {
  frameRate(100);
  createCanvas(640, 640);
  w = 40;
  columns = floor(width / w);
  rows = floor(height / w);
  
  // Initialize the board and next arrays
  board = new Array(columns);
  for (let i = 0; i < columns; i++) {
    board[i] = new Array(rows);
  }
  next = new Array(columns);
  for (let i = 0; i < columns; i++) {
    next[i] = new Array(rows);
  }
  
  init(); // Initialize the board and other elements
}

// Event listener for scroll
window.addEventListener("scroll", (event) => {
  ypos = this.scrollY;
  xpos = this.scrollX;
});

// Toggle the value of a cell in the board
function toggle(i, j) {
  if (i < columns && j < rows) {
    board[i][j] = (board[i][j] === 1) ? -1 : 1;
  }
}

// Event listener for touch (mobile devices)
function touchStarted(event) {
  let i = Math.floor((event.clientX + xpos) / w);
  let j = Math.floor((event.clientY + ypos) / w);
  toggle(i, j);
}

function draw() {
  background(255);
  if (evolve) {
    evolveNetwork();
    updatePlot();
  }
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      if (board[i][j] === 1) {
        fill(0);
      } else {
        fill(255);
      }
      ((i * rows + j) === selectedIndex) ? stroke(0, 255, 0) : stroke(50);
      ((i * rows + j) === selectedIndex) ? strokeWeight(4) : strokeWeight(1);
      rect(i * w, j * w, w - 1, w - 1);
    }
  }

  frameNo += 1;
  frameTime = Date.now();
}

setInterval(() => {
  document.getElementById("fr").innerHTML = `Current frame rate: ${Math.round((frameNo - lastframeNo) * 1000 / (frameTime - lastframeTime))}`;
  lastframeNo = frameNo;
  lastframeTime = Date.now();
}, 200);

function reset() {
  if (evolve) {
    startStop();
  }
  selectedIndex = null;
  Plotly.deleteTraces("myDiv", 0);
  init();
}

function init() {
  plotme(); // Create the initial plot
  // Initialize the board with all cells set to -1
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      board[i][j] = -1;
      next[i][j] = -1;
    }
  }

  ImgVector = imgToVector(board);
  let length = ImgVector.length;

  // Initialize the WeightMatrix array
  WeightMatrix = new Array(length);
  for (let i = 0; i < length; i++) {
    WeightMatrix[i] = new Array(length);
  }

  learnHebbianWeights(ImgVector);
  nOfImgs = 0;
  memoryList.innerHTML = `
  `;

  let canvasElement = document.getElementById("defaultCanvas0");

  // Event listeners for drawing on the canvas
  canvasElement.addEventListener("mousedown", (e) => {
    isDrawing = true;
  });

  canvasElement.addEventListener("mousemove", (e) => {
    if (isDrawing) {
      let i = Math.floor((e.clientX + xpos) / w);
      let j = Math.floor((e.clientY + ypos) / w);
      board[i][j] = 1;
    }
  });

  window.addEventListener("mouseup", (e) => {
    if (isDrawing) {
      isDrawing = false;
    }
  });
}

// Randomize the board
function randInput() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      board[i][j] = (floor(random(2)) === 1) ? 1 : -1;
      next[i][j] = -1;
    }
  }
}

// Convert the board to a vector
function imgToVector(arrayOfArrays) {
  let ImgArray = [];
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      ImgArray.push(arrayOfArrays[i][j]);
    }
  }
  return ImgArray;
}

// Convert a vector to a board
function vectorToImg(imageVector) {
  let ImgArray = new Array(columns);
  for (let i = 0; i < columns; i++) {
    ImgArray[i] = new Array(rows);
  }
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      let n = i * rows + j;
      ImgArray[i][j] = imageVector[n];
    }
  }
  return ImgArray;
}

// Learn the Hebbian weights based on the image vector
function learnHebbianWeights(imgVctr) {
  document.getElementById("memoryList").innerHTML = "";
  updateLearnedList();
  nOfImgs = 0;
  for (let i = 0; i < imgVctr.length; i++) {
    for (let j = 0; j < imgVctr.length; j++) {
      WeightMatrix[i][j] = imgVctr[i] * imgVctr[j];
    }
  }
}

// Check the threshold for activation
function checkThresholdForActivation(index, imageVector, WeightMatrix) {
  let summation = 0;
  for (let i = 0; i < imageVector.length; i++) {
    summation += WeightMatrix[index][i] * imageVector[i];
  }
  summation -= WeightMatrix[index][index] * imageVector[index];
  return (summation >= 0) ? 1 : -1;
}

// Calculate the energy of the system
function calculateEnergy() {
  let imgVctr = imgToVector(board);
  let summation = 0;
  for (let i = 0; i < imgVctr.length; i++) {
    for (let j = 0; j < imgVctr.length; j++) {
      summation += WeightMatrix[i][j] * imgVctr[i] * imgVctr[j];
    }
  }
  let energy = -(1 / 2) * summation;
  return energy;
}

// Evolve the network
function evolveNetwork() {
  let newVector = imgToVector(board);
  let randomIndex = floor(random(newVector.length));
  selectedIndex = randomIndex;
  let initial = newVector[randomIndex];
  newVector[randomIndex] = checkThresholdForActivation(randomIndex, newVector, WeightMatrix);
  next = vectorToImg(newVector);
  board = next;
}

// Update the learned image list
function updateLearnedList() {
  let memoryList = document.getElementById("memoryList");
  let currentCanvas = document.getElementById("defaultCanvas0");
  let context = currentCanvas.getContext("2d");
  let canvasData = currentCanvas.toDataURL();
  let data = canvasData.image;
  memoryList.innerHTML += `
    <img src="${canvasData}" style="width: 100px;padding:5px;">
  `;
}

// Learn the current board state
function learn() {
  ImgVector = imgToVector(board);
  learnHebbianWeights(ImgVector);
}

// Stack the current image on top of the learned images
function stackImg() {
  imgVctr = imgToVector(board);
  updateLearnedList();
  for (let i = 0; i < imgVctr.length; i++) {
    for (let j = 0; j < imgVctr.length; j++) {
      newWeight = imgVctr[i] * imgVctr[j];
      WeightMatrix[i][j] = (WeightMatrix[i][j] * nOfImgs + newWeight) / (nOfImgs + 1);
    }
  }
  nOfImgs += 1;
}

// Clear the canvas
function clearcanvas() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      board[i][j] = -1;
      next[i][j] = -1;
    }
  }
}

// Fill the canvas randomly
function fillrandom() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      board[i][j] = (floor(random(2)) === 1) ? 1 : -1;
    }
  }
}

// Start or stop the evolution of the network
function startStop() {
  evolve = !evolve;
  if (evolve) {
    document.getElementById("startStopBtn").innerHTML = `Stop`;
  } else {
    document.getElementById("startStopBtn").innerHTML = `Start`;
  }
}

// Plot the energy vs time
function plotme() {
  Plotly.newPlot('myDiv', [{
    y: [0],
    mode: 'lines',
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

// Update the plot with the current energy value
function updatePlot() {
  let energy = calculateEnergy();
  Plotly.extendTraces('myDiv', { y: [[energy]] }, [0]);
}
