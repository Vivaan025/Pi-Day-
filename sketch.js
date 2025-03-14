// <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <title>Pi Digit Collision Simulation</title>
//   <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js"></script>
//   <style>
//     body {
//       margin: 0;
//       padding: 20px;
//       font-family: Arial, sans-serif;
//     }
//     .container {
//       display: flex;
//       flex-wrap: wrap;
//     }
//     .simulation {
//       flex: 1;
//       min-width: 500px;
//     }
//     .controls {
//       flex: 1;
//       min-width: 300px;
//       padding: 20px;
//     }
//     .slider-container {
//       margin-bottom: 15px;
//     }
//     .slider-label {
//       display: inline-block;
//       width: 180px;
//     }
//     h1 {
//       color: #333;
//     }
//     canvas {
//       border: 1px solid #ccc;
//     }
//     .result {
//       margin-top: 20px;
//       font-size: 18px;
//       font-weight: bold;
//     }
//     button {
//       padding: 10px 15px;
//       background-color: #4CAF50;
//       color: white;
//       border: none;
//       border-radius: 4px;
//       cursor: pointer;
//       margin-right: 10px;
//       margin-bottom: 10px;
//       font-size: 16px;
//     }
//     button:hover {
//       background-color: #45a049;
//     }
//   </style>
// </head>
// <body>
//   <h1>Pi Approximation from Block Collisions</h1>
  
//   <div class="container">
//     <div class="simulation" id="simulation-container"></div>
    
//     <div class="controls">
//       <h2>Controls</h2>
      
//       <div class="slider-container">
//         <span class="slider-label">Small Block Position:</span>
//         <input type="range" id="smallBlockPos" min="50" max="300" value="100">
//         <span id="smallBlockPosValue">100</span>
//       </div>
      
//       <div class="slider-container">
//         <span class="slider-label">Large Block Position:</span>
//         <input type="range" id="largeBlockPos" min="350" max="600" value="400">
//         <span id="largeBlockPosValue">400</span>
//       </div>
      
//       <div class="slider-container">
//         <span class="slider-label">Small Block Mass:</span>
//         <input type="range" id="smallBlockMass" min="1" max="10" value="1">
//         <span id="smallBlockMassValue">1</span>
//       </div>
      
//       <div class="slider-container">
//         <span class="slider-label">Large Block Mass Ratio:</span>
//         <input type="range" id="massRatio" min="1" max="10000" value="100">
//         <span id="massRatioValue">100</span>
//       </div>
      
//       <div class="slider-container">
//         <span class="slider-label">Initial Velocity:</span>
//         <input type="range" id="initialVelocity" min="-5" max="0" step="0.1" value="-2">
//         <span id="initialVelocityValue">-2</span>
//       </div>
      
//       <div class="slider-container">
//         <span class="slider-label">Time Scale:</span>
//         <input type="range" id="timeScale" min="1" max="20" value="5">
//         <span id="timeScaleValue">5</span>
//       </div>
      
//       <button id="startBtn">Start</button>
//       <button id="resetBtn">Reset</button>
//       <button id="pauseBtn">Pause</button>
      
//       <div class="result">
//         <p>Total Collisions: <span id="collisionCount">0</span></p>
//         <p>Pi Approximation: <span id="piApprox">-</span></p>
//       </div>
//     </div>
//   </div>

//   <script>
//     let sketch = function(p) {
//       // Simulation variables
//       let smallBlock, largeBlock;
//       let collisionCount = 0;
//       let running = false;
//       let paused = false;
//       let timeScale = 5;
//       let circlePoints = [];
//       let maxCirclePoints = 500;
      
//       // DOM elements
//       let smallBlockPosSlider, largeBlockPosSlider;
//       let smallBlockMassSlider, massRatioSlider;
//       let initialVelocitySlider, timeScaleSlider;
//       let startBtn, resetBtn, pauseBtn;
//       let collisionCountElement, piApproxElement;
      
//       // Define Block class
//       class Block {
//         constructor(mass, x, w, color) {
//           this.mass = mass;
//           this.x = x;
//           this.y = 300;
//           this.w = w;
//           this.h = 50 + mass * 5;
//           this.v = 0;
//           this.color = color;
//         }
        
//         show() {
//           p.fill(this.color);
//           p.rect(this.x, this.y - this.h, this.w, this.h);
          
//           // Draw velocity vector
//           p.push();
//           if (this.v > 0) {
//             p.fill(0, 255, 0);
//           } else if (this.v < 0) {
//             p.fill(255, 0, 0);
//           } else {
//             p.fill(128);
//           }
          
//           let arrowLength = this.v * 10;
//           p.rect(this.x + this.w/2 - 2, this.y - this.h - 20, 4, 15);
//           p.triangle(
//             this.x + this.w/2 - 8, this.y - this.h - 20 + arrowLength,
//             this.x + this.w/2 + 8, this.y - this.h - 20 + arrowLength,
//             this.x + this.w/2, this.y - this.h - 30 + arrowLength
//           );
//           p.pop();
//         }
        
//         update() {
//           this.x += this.v;
//         }
        
//         collide(other) {
//           return !(this.x + this.w < other.x || this.x > other.x + other.w);
//         }
//       }
      
//       p.setup = function() {
//         p.createCanvas(700, 500);
        
//         // Initialize simulation components
//         resetSimulation();
        
//         // Connect DOM elements
//         smallBlockPosSlider = document.getElementById('smallBlockPos');
//         largeBlockPosSlider = document.getElementById('largeBlockPos');
//         smallBlockMassSlider = document.getElementById('smallBlockMass');
//         massRatioSlider = document.getElementById('massRatio');
//         initialVelocitySlider = document.getElementById('initialVelocity');
//         timeScaleSlider = document.getElementById('timeScale');
        
//         smallBlockPosValue = document.getElementById('smallBlockPosValue');
//         largeBlockPosValue = document.getElementById('largeBlockPosValue');
//         smallBlockMassValue = document.getElementById('smallBlockMassValue');
//         massRatioValue = document.getElementById('massRatioValue');
//         initialVelocityValue = document.getElementById('initialVelocityValue');
//         timeScaleValue = document.getElementById('timeScaleValue');
        
//         startBtn = document.getElementById('startBtn');
//         resetBtn = document.getElementById('resetBtn');
//         pauseBtn = document.getElementById('pauseBtn');
        
//         collisionCountElement = document.getElementById('collisionCount');
//         piApproxElement = document.getElementById('piApprox');
        
//         // Add event listeners
//         smallBlockPosSlider.addEventListener('input', updateSmallBlockPos);
//         largeBlockPosSlider.addEventListener('input', updateLargeBlockPos);
//         smallBlockMassSlider.addEventListener('input', updateMasses);
//         massRatioSlider.addEventListener('input', updateMasses);
//         initialVelocitySlider.addEventListener('input', updateInitialVelocity);
//         timeScaleSlider.addEventListener('input', updateTimeScale);
        
//         startBtn.addEventListener('click', startSimulation);
//         resetBtn.addEventListener('click', resetSimulation);
//         pauseBtn.addEventListener('click', togglePause);
        
//         // Initial UI update
//         updateSmallBlockPos();
//         updateLargeBlockPos();
//         updateMasses();
//         updateInitialVelocity();
//         updateTimeScale();
//       };
      
//       function resetSimulation() {
//         // Reset simulation state
//         running = false;
//         paused = false;
//         collisionCount = 0;
//         circlePoints = [];
        
//         // Create blocks with default values
//         let smallMass = parseInt(smallBlockMassSlider?.value || 1);
//         let largeBlockMass = smallMass * parseInt(massRatioSlider?.value || 100);
        
//         smallBlock = new Block(
//           smallMass,
//           parseInt(smallBlockPosSlider?.value || 100),
//           30,
//           p.color(50, 150, 200)
//         );
        
//         largeBlock = new Block(
//           largeBlockMass,
//           parseInt(largeBlockPosSlider?.value || 400),
//           50,
//           p.color(200, 100, 50)
//         );
        
//         // Update counters
//         if (collisionCountElement) collisionCountElement.textContent = collisionCount;
//         if (piApproxElement) piApproxElement.textContent = "-";
        
//         // Update UI state
//         if (startBtn) startBtn.disabled = false;
//         if (pauseBtn) pauseBtn.disabled = true;
//       }
      
//       function startSimulation() {
//         if (!running) {
//           running = true;
//           paused = false;
          
//           // Set initial velocity
//           smallBlock.v = parseFloat(initialVelocitySlider.value);
          
//           // Update UI state
//           startBtn.disabled = true;
//           pauseBtn.disabled = false;
//         }
//       }
      
//       function togglePause() {
//         paused = !paused;
//         pauseBtn.textContent = paused ? "Resume" : "Pause";
//       }
      
//       function updateSmallBlockPos() {
//         let pos = parseInt(smallBlockPosSlider.value);
//         smallBlockPosValue.textContent = pos;
//         if (smallBlock) smallBlock.x = pos;
//       }
      
//       function updateLargeBlockPos() {
//         let pos = parseInt(largeBlockPosSlider.value);
//         largeBlockPosValue.textContent = pos;
//         if (largeBlock) largeBlock.x = pos;
//       }
      
//       function updateMasses() {
//         let smallMass = parseInt(smallBlockMassSlider.value);
//         let ratio = parseInt(massRatioSlider.value);
//         let largeMass = smallMass * ratio;
        
//         smallBlockMassValue.textContent = smallMass;
//         massRatioValue.textContent = ratio;
        
//         if (smallBlock && largeBlock) {
//           smallBlock.mass = smallMass;
//           smallBlock.h = 50 + smallMass * 5;
          
//           largeBlock.mass = largeMass;
//           largeBlock.h = 50 + Math.min(largeMass * 0.5, 150);
//         }
//       }
      
//       function updateInitialVelocity() {
//         let vel = parseFloat(initialVelocitySlider.value);
//         initialVelocityValue.textContent = vel;
//       }
      
//       function updateTimeScale() {
//         timeScale = parseInt(timeScaleSlider.value);
//         timeScaleValue.textContent = timeScale;
//       }
      
//       p.draw = function() {
//         p.background(240);
        
//         if (running && !paused) {
//           // Update physics multiple times per frame for stability
//           for (let i = 0; i < timeScale; i++) {
//             updatePhysics();
//           }
//         }
        
//         // Draw floor
//         p.stroke(0);
//         p.strokeWeight(2);
//         p.line(0, 300, p.width, 300);
        
//         // Draw blocks
//         smallBlock.show();
//         largeBlock.show();
        
//         // Draw circle graph (Pi visualization)
//         drawCircleGraph();
        
//         // Draw instructions
//         p.noStroke();
//         p.fill(0);
//         p.textSize(12);
//         p.text("This simulation calculates π using elastic collisions. The number of collisions approaches π × √(m₂/m₁) as the mass ratio increases.", 20, 350);
//         p.text("Move the blocks using the sliders. The small block should be to the left of the large block.", 20, 370);
//       };
      
//       function updatePhysics() {
//         // Update positions
//         smallBlock.update();
//         largeBlock.update();
        
//         // Check for wall collision
//         if (smallBlock.x <= 0) {
//           smallBlock.v = Math.abs(smallBlock.v);
//           collisionCount++;
//           updateCollisionCount();
//           addCirclePoint();
//         }
        
//         // Check for block-block collision
//         if (smallBlock.x + smallBlock.w >= largeBlock.x) {
//           // Elastic collision formula
//           let v1 = smallBlock.v;
//           let v2 = largeBlock.v;
//           let m1 = smallBlock.mass;
//           let m2 = largeBlock.mass;
          
//           smallBlock.v = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2);
//           largeBlock.v = ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2);
          
//           // Ensure blocks don't overlap
//           smallBlock.x = largeBlock.x - smallBlock.w - 1;
          
//           collisionCount++;
//           updateCollisionCount();
//           addCirclePoint();
//         }
        
//         // Check if the large block hits the right wall
//         if (largeBlock.x + largeBlock.w >= p.width) {
//           largeBlock.v = -Math.abs(largeBlock.v);
//           collisionCount++;
//           updateCollisionCount();
//           addCirclePoint();
//         }
        
//         // Check for simulation end
//         checkSimulationEnd();
//       }
      
//       function updateCollisionCount() {
//         if (collisionCountElement) {
//           collisionCountElement.textContent = collisionCount;
//         }
        
//         // Update Pi approximation
//         let massRatio = largeBlock.mass / smallBlock.mass;
//         let piApprox = collisionCount / Math.sqrt(massRatio);
        
//         if (piApproxElement) {
//           piApproxElement.textContent = piApprox.toFixed(6);
//         }
//       }
      
//       function addCirclePoint() {
//         // Add a point to the circle graph based on collision count
//         let angle = (circlePoints.length * 0.1) % (Math.PI * 2);
//         circlePoints.push({
//           x: Math.cos(angle),
//           y: Math.sin(angle),
//           count: collisionCount
//         });
        
//         // Limit number of points
//         if (circlePoints.length ></script>
// Simulation variables
let smallBlock, largeBlock;
let collisionCount = 0;
let running = false;
let paused = false;
let timeScale = 5;
let circlePoints = [];
let maxCirclePoints = 500;

// UI elements
let smallBlockPosSlider, largeBlockPosSlider;
let smallBlockMassSlider, massRatioSlider;
let initialVelocitySlider, timeScaleSlider;
let startBtn, resetBtn, pauseBtn;
let collisionCountElement, piApproxElement;

// Define Block class
class Block {
  constructor(mass, x, w, color) {
    this.mass = mass;
    this.x = x;
    this.y = 300;
    this.w = w;
    this.h = 50 + mass * 5;
    this.v = 0;
    this.color = color;
  }
  
  show() {
    fill(this.color);
    rect(this.x, this.y - this.h, this.w, this.h);
    
    // Draw velocity vector
    push();
    if (this.v > 0) {
      fill(0, 255, 0);
    } else if (this.v < 0) {
      fill(255, 0, 0);
    } else {
      fill(128);
    }
    
    let arrowLength = this.v * 10;
    rect(this.x + this.w/2 - 2, this.y - this.h - 20, 4, 15);
    triangle(
      this.x + this.w/2 - 8, this.y - this.h - 20 + arrowLength,
      this.x + this.w/2 + 8, this.y - this.h - 20 + arrowLength,
      this.x + this.w/2, this.y - this.h - 30 + arrowLength
    );
    pop();
  }
  
  update() {
    this.x += this.v;
  }
  
  collide(other) {
    return !(this.x + this.w < other.x || this.x > other.x + other.w);
  }
}

function setup() {
  createCanvas(900, 600);
  
  // Create UI elements
  createUI();
  
  // Initialize simulation components
  resetSimulation();
}

function createUI() {
  // Create container div for controls
  let container = createDiv();
  container.position(10, 10);
  container.style('width', '880px');
  container.style('display', 'flex');
  container.style('flex-direction', 'column');
  container.style('background-color', '#f0f0f0');
  container.style('padding', '10px');
  container.style('border-radius', '5px');
  
  createP('Pi Approximation from Block Collisions').parent(container).style('font-weight', 'bold').style('font-size', '18px');
  
  // Create sliders container
  let slidersDiv = createDiv();
  slidersDiv.parent(container);
  slidersDiv.style('display', 'flex');
  slidersDiv.style('flex-wrap', 'wrap');
  slidersDiv.style('justify-content', 'space-between');
  
  // Small block position slider
  let smallBlockPosDiv = createDiv();
  smallBlockPosDiv.parent(slidersDiv);
  smallBlockPosDiv.style('margin', '5px');
  smallBlockPosDiv.style('width', '400px');
  createSpan('Small Block Position: ').parent(smallBlockPosDiv);
  smallBlockPosSlider = createSlider(50, 300, 100);
  smallBlockPosSlider.parent(smallBlockPosDiv);
  smallBlockPosSlider.input(updateSmallBlockPos);
  smallBlockPosValue = createSpan('100').parent(smallBlockPosDiv);
  
  // Large block position slider
  let largeBlockPosDiv = createDiv();
  largeBlockPosDiv.parent(slidersDiv);
  largeBlockPosDiv.style('margin', '5px');
  largeBlockPosDiv.style('width', '400px');
  createSpan('Large Block Position: ').parent(largeBlockPosDiv);
  largeBlockPosSlider = createSlider(350, 700, 400);
  largeBlockPosSlider.parent(largeBlockPosDiv);
  largeBlockPosSlider.input(updateLargeBlockPos);
  largeBlockPosValue = createSpan('400').parent(largeBlockPosDiv);
  
  // Small block mass slider
  let smallMassDiv = createDiv();
  smallMassDiv.parent(slidersDiv);
  smallMassDiv.style('margin', '5px');
  smallMassDiv.style('width', '400px');
  createSpan('Small Block Mass: ').parent(smallMassDiv);
  smallBlockMassSlider = createSlider(1, 10, 1);
  smallBlockMassSlider.parent(smallMassDiv);
  smallBlockMassSlider.input(updateMasses);
  smallBlockMassValue = createSpan('1').parent(smallMassDiv);
  
  // Mass ratio slider
  let massRatioDiv = createDiv();
  massRatioDiv.parent(slidersDiv);
  massRatioDiv.style('margin', '5px');
  massRatioDiv.style('width', '400px');
  createSpan('Large Block Mass Ratio: ').parent(massRatioDiv);
  massRatioSlider = createSlider(1, 10000, 100);
  massRatioSlider.parent(massRatioDiv);
  massRatioSlider.input(updateMasses);
  massRatioValue = createSpan('100').parent(massRatioDiv);
  
  // Initial velocity slider
  let velocityDiv = createDiv();
  velocityDiv.parent(slidersDiv);
  velocityDiv.style('margin', '5px');
  velocityDiv.style('width', '400px');
  createSpan('Initial Velocity: ').parent(velocityDiv);
  initialVelocitySlider = createSlider(-5, 0, -2, 0.1);
  initialVelocitySlider.parent(velocityDiv);
  initialVelocitySlider.input(updateInitialVelocity);
  initialVelocityValue = createSpan('-2').parent(velocityDiv);
  
  // Time scale slider
  let timeScaleDiv = createDiv();
  timeScaleDiv.parent(slidersDiv);
  timeScaleDiv.style('margin', '5px');
  timeScaleDiv.style('width', '400px');
  createSpan('Time Scale: ').parent(timeScaleDiv);
  timeScaleSlider = createSlider(1, 20, 5);
  timeScaleSlider.parent(timeScaleDiv);
  timeScaleSlider.input(updateTimeScale);
  timeScaleValue = createSpan('5').parent(timeScaleDiv);
  
  // Buttons
  let buttonsDiv = createDiv();
  buttonsDiv.parent(container);
  buttonsDiv.style('margin', '10px 0');
  
  startBtn = createButton('Start');
  startBtn.parent(buttonsDiv);
  startBtn.mousePressed(startSimulation);
  startBtn.style('margin-right', '10px');
  startBtn.style('padding', '5px 15px');
  
  resetBtn = createButton('Reset');
  resetBtn.parent(buttonsDiv);
  resetBtn.mousePressed(resetSimulation);
  resetBtn.style('margin-right', '10px');
  resetBtn.style('padding', '5px 15px');
  
  pauseBtn = createButton('Pause');
  pauseBtn.parent(buttonsDiv);
  pauseBtn.mousePressed(togglePause);
  pauseBtn.style('padding', '5px 15px');
  pauseBtn.attribute('disabled', '');
  
  // Results display
  let resultsDiv = createDiv();
  resultsDiv.parent(container);
  resultsDiv.style('margin-top', '10px');
  
  createSpan('Total Collisions: ').parent(resultsDiv).style('font-weight', 'bold');
  collisionCountElement = createSpan('0').parent(resultsDiv);
  resultsDiv.child(createP());
  
  createSpan('Pi Approximation: ').parent(resultsDiv).style('font-weight', 'bold');
  piApproxElement = createSpan('-').parent(resultsDiv);
}

function resetSimulation() {
  // Reset simulation state
  running = false;
  paused = false;
  collisionCount = 0;
  circlePoints = [];
  
  // Create blocks with default values
  let smallMass = parseInt(smallBlockMassSlider.value());
  let largeBlockMass = smallMass * parseInt(massRatioSlider.value());
  
  smallBlock = new Block(
    smallMass,
    parseInt(smallBlockPosSlider.value()),
    30,
    color(50, 150, 200)
  );
  
  largeBlock = new Block(
    largeBlockMass,
    parseInt(largeBlockPosSlider.value()),
    50,
    color(200, 100, 50)
  );
  
  // Update counters
  collisionCountElement.html(collisionCount);
  piApproxElement.html("-");
  
  // Update UI state
  startBtn.removeAttribute('disabled');
  pauseBtn.attribute('disabled', '');
}

function startSimulation() {
  if (!running) {
    running = true;
    paused = false;
    
    // Set initial velocity
    smallBlock.v = parseFloat(initialVelocitySlider.value());
    
    // Update UI state
    startBtn.attribute('disabled', '');
    pauseBtn.removeAttribute('disabled');
  }
}

function togglePause() {
  paused = !paused;
  pauseBtn.html(paused ? "Resume" : "Pause");
}

function updateSmallBlockPos() {
  let pos = parseInt(smallBlockPosSlider.value());
  smallBlockPosValue.html(pos);
  if (smallBlock) smallBlock.x = pos;
}

function updateLargeBlockPos() {
  let pos = parseInt(largeBlockPosSlider.value());
  largeBlockPosValue.html(pos);
  if (largeBlock) largeBlock.x = pos;
}

function updateMasses() {
  let smallMass = parseInt(smallBlockMassSlider.value());
  let ratio = parseInt(massRatioSlider.value());
  let largeMass = smallMass * ratio;
  
  smallBlockMassValue.html(smallMass);
  massRatioValue.html(ratio);
  
  if (smallBlock && largeBlock) {
    smallBlock.mass = smallMass;
    smallBlock.h = 50 + smallMass * 5;
    
    largeBlock.mass = largeMass;
    largeBlock.h = 50 + min(largeMass * 0.5, 150);
  }
}

function updateInitialVelocity() {
  let vel = parseFloat(initialVelocitySlider.value());
  initialVelocityValue.html(vel);
}

function updateTimeScale() {
  timeScale = parseInt(timeScaleSlider.value());
  timeScaleValue.html(timeScale);
}

function draw() {
  background(240);
  
  // Draw the main simulation area
  push();
  translate(0, 150);
  
  if (running && !paused) {
    // Update physics multiple times per frame for stability
    for (let i = 0; i < timeScale; i++) {
      updatePhysics();
    }
  }
  
  // Draw floor
  stroke(0);
  strokeWeight(2);
  line(0, 300, width, 300);
  
  // Draw blocks
  smallBlock.show();
  largeBlock.show();
  pop();
  
  // Draw circle graph (Pi visualization)
  drawCircleGraph();
  
  // Draw instructions
  noStroke();
  fill(0);
  textSize(12);
  text("This simulation calculates π using elastic collisions. The number of collisions approaches π × √(m₂/m₁) as the mass ratio increases.", 20, 550);
  text("Move the blocks using the sliders. The small block should be to the left of the large block.", 20, 570);
}

function updatePhysics() {
  // Update positions
  smallBlock.update();
  largeBlock.update();
  
  // Check for wall collision
  if (smallBlock.x <= 0) {
    smallBlock.v = Math.abs(smallBlock.v);
    collisionCount++;
    updateCollisionCount();
    addCirclePoint();
  }
  
  // Check for block-block collision
  if (smallBlock.x + smallBlock.w >= largeBlock.x) {
    // Elastic collision formula
    let v1 = smallBlock.v;
    let v2 = largeBlock.v;
    let m1 = smallBlock.mass;
    let m2 = largeBlock.mass;
    
    smallBlock.v = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2);
    largeBlock.v = ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2);
    
    // Ensure blocks don't overlap
    smallBlock.x = largeBlock.x - smallBlock.w - 1;
    
    collisionCount++;
    updateCollisionCount();
    addCirclePoint();
  }
  
  // Check if the large block hits the right wall
  if (largeBlock.x + largeBlock.w >= width) {
    largeBlock.v = -Math.abs(largeBlock.v);
    collisionCount++;
    updateCollisionCount();
    addCirclePoint();
  }
  
  // Check for simulation end
  checkSimulationEnd();
}

function updateCollisionCount() {
  // Update collision counter
  collisionCountElement.html(collisionCount);
  
  // Update Pi approximation
  let massRatio = largeBlock.mass / smallBlock.mass;
  let piApprox = collisionCount / Math.sqrt(massRatio);
  piApproxElement.html(piApprox.toFixed(6));
}

function addCirclePoint() {
  // Add a point to the circle graph based on collision count
  let angle = (circlePoints.length * 0.1) % (Math.PI * 2);
  circlePoints.push({
    x: Math.cos(angle),
    y: Math.sin(angle),
    count: collisionCount
  });
  
  // Limit number of points
  if (circlePoints.length > maxCirclePoints) {
    circlePoints.shift();
  }
}

function drawCircleGraph() {
  // Draw circle graph in top right corner
  let graphX = width - 200;
  let graphY = 100;
  let graphRadius = 80;
  
  push();
  translate(graphX, graphY);
  
  // Draw circle outline
  noFill();
  stroke(100);
  strokeWeight(1);
  ellipse(0, 0, graphRadius * 2);
  
  // Draw axes
  line(-graphRadius, 0, graphRadius, 0);
  line(0, -graphRadius, 0, graphRadius);
  
  // Draw points
  noStroke();
}