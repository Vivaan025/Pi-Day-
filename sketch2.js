// Simulation variables
let smallBlock, largeBlock;
let collisionCount = 0;
let running = false;
let paused = false;
let timeScale = 5;
let circlePoints = [];
let maxCirclePoints = 500;
let autoCollide = true;
let wallPosition = 20;

// UI elements
let smallBlockPosSlider, largeBlockPosSlider;
let smallBlockMassSlider, massRatioSlider;
let initialVelocitySlider, timeScaleSlider;
let startBtn, resetBtn, pauseBtn, collideBtn;
let collisionCountElement, piApproxElement;
let autoCollideCheckbox;

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
  smallBlockPosSlider = createSlider(wallPosition + 20, 300, 100);
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
  
  // Auto collide checkbox
  let autoCollideDiv = createDiv();
  autoCollideDiv.parent(slidersDiv);
  autoCollideDiv.style('margin', '5px');
  autoCollideDiv.style('width', '400px');
  createSpan('Auto Collide: ').parent(autoCollideDiv);
  autoCollideCheckbox = createCheckbox('', true);
  autoCollideCheckbox.parent(autoCollideDiv);
  autoCollideCheckbox.changed(toggleAutoCollide);
  
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
  pauseBtn.style('margin-right', '10px');
  pauseBtn.style('padding', '5px 15px');
  pauseBtn.attribute('disabled', '');
  
  collideBtn = createButton('Manually Collide');
  collideBtn.parent(buttonsDiv);
  collideBtn.mousePressed(manualCollide);
  collideBtn.style('padding', '5px 15px');
  
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

function toggleAutoCollide() {
  autoCollide = autoCollideCheckbox.checked();
  collideBtn.style('display', autoCollide ? 'none' : 'inline-block');
}

function manualCollide() {
  if (!running) return;
  
  // Trigger the block-block collision
  performBlockCollision();
}

function performBlockCollision() {
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
  toggleAutoCollide();
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

function updateCollisionCount() {
  collisionCountElement.html(collisionCount);
  
  // Calculate pi approximation
  if (collisionCount > 0) {
    let smallMass = smallBlock.mass;
    let largeMass = largeBlock.mass;
    let massRatio = largeMass / smallMass;
    let piApprox = collisionCount / Math.sqrt(massRatio);
    
    piApproxElement.html(piApprox.toFixed(6));
  }
}

function addCirclePoint() {
  // Add a new point to the circle visualization
  let angle = collisionCount * 0.1;
  let x = 750 + 100 * Math.cos(angle);
  let y = 400 + 100 * Math.sin(angle);
  
  circlePoints.push({x, y});
  
  // Limit the number of points to avoid performance issues
  if (circlePoints.length > maxCirclePoints) {
    circlePoints.shift();
  }
}

function drawCircleGraph() {
  // Draw the circle graph for pi visualization
  push();
  
  // Draw circle outline
  noFill();
  stroke(100);
  strokeWeight(1);
  ellipse(750, 400, 200, 200);
  
  // Draw points
  stroke(0, 100, 255);
  strokeWeight(2);
  for (let i = 0; i < circlePoints.length; i++) {
    point(circlePoints[i].x, circlePoints[i].y);
  }
  
  // Draw lines between points
  noFill();
  stroke(0, 100, 255, 100);
  beginShape();
  for (let i = 0; i < circlePoints.length; i++) {
    vertex(circlePoints[i].x, circlePoints[i].y);
  }
  endShape();
  
  // Draw axes
  stroke(100);
  strokeWeight(1);
  line(650, 400, 850, 400);
  line(750, 300, 750, 500);
  
  // Draw center point
  fill(0);
  noStroke();
  ellipse(750, 400, 5, 5);
  
  pop();
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
  
  // Draw wall
  fill(100);
  rect(wallPosition - 10, 0, 10, 300);
  
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
  text("When masses are equal, you'll see 3 collisions for one cycle: block-block, block-wall, block-block.", 20, 590);
}

function updatePhysics() {
    // Update positions
    smallBlock.update();
    largeBlock.update();
    
    // Check for left wall collision
    if (smallBlock.x <= wallPosition) {
      smallBlock.v = -smallBlock.v; // Simply reverse direction on wall collision
      smallBlock.x = wallPosition + 1; // Prevent sticking to wall
      collisionCount++;
      updateCollisionCount();
      addCirclePoint();
    }
    
    // Check for collision between blocks (big block hitting small block, not the other way around)
    if (smallBlock.x + smallBlock.w >= largeBlock.x && smallBlock.v > largeBlock.v) {
      // Use the elastic collision formula directly as in the pygame example
      let v1 = smallBlock.v;
      let v2 = largeBlock.v;
      let m1 = smallBlock.mass;
      let m2 = largeBlock.mass;
      
      smallBlock.v = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2);
      largeBlock.v = ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2);
      
      // Prevent overlap
      smallBlock.x = largeBlock.x - smallBlock.w - 1;
      
      collisionCount++;
      updateCollisionCount();
      addCirclePoint();
    }
    
    // There is NO right wall - blocks can move freely off the right edge
    // If blocks go too far right, reset the simulation
    if (smallBlock.x > width + 200 || largeBlock.x > width + 200) {
      resetSimulation();
    }
    
    // If blocks go too far left, reset the simulation
    if (largeBlock.x < -200) {
      resetSimulation();
    }
  }
  
  function drawCircleGraph() {
    // Draw the circle graph for pi visualization
    push();
    
    // Draw circle outline
    noFill();
    stroke(100);
    strokeWeight(1);
    ellipse(750, 400, 200, 200);
    
    // Draw points
    stroke(0, 100, 255);
    strokeWeight(2);
    for (let i = 0; i < circlePoints.length; i++) {
      point(circlePoints[i].x, circlePoints[i].y);
    }
    
    // Draw lines between points
    noFill();
    stroke(0, 100, 255, 100);
    beginShape();
    for (let i = 0; i < circlePoints.length; i++) {
      vertex(circlePoints[i].x, circlePoints[i].y);
    }
    endShape();
    
    // Draw axes
    stroke(100);
    strokeWeight(1);
    line(650, 400, 850, 400);
    line(750, 300, 750, 500);
    
    // Draw center point
    fill(0);
    noStroke();
    ellipse(750, 400, 5, 5);
    
    pop();
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
    
    // Draw wall - only on the left side
    fill(100);
    rect(wallPosition - 10, 0, 10, 300);
    
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
    text("When masses are equal, you'll see 3 collisions for one cycle: block-block, block-wall, block-block.", 20, 590);
  } 
// function updatePhysics() {
//   // Update positions
//   smallBlock.update();
//   largeBlock.update();
  
//   // Check for wall collision
//   if (smallBlock.x <= wallPosition) {
//     smallBlock.v = Math.abs(smallBlock.v);
//     // Ensure block doesn't go through wall
//     smallBlock.x = wallPosition + 1;
//     collisionCount++;
//     updateCollisionCount();
//     addCirclePoint();
//   }
  
//   // Check for block-block collision
//   if (autoCollide && smallBlock.x + smallBlock.w >= largeBlock.x) {
//     performBlockCollision();
//   }
  
//   // Check if the large block hits the right wall
//   if (largeBlock.x + largeBlock.w >= width) {
//     largeBlock.v = -Math.abs(largeBlock.v);
//     largeBlock.x = width - largeBlock.w - 1;
    
//     // Optional: You can count this as a collision too if you want
//     // collisionCount++;
//     // updateCollisionCount();
//     // addCirclePoint();
//   }
  
//   // Check if the simulation should stop (e.g., blocks moving too slowly)
//   if (Math.abs(smallBlock.v) < 0.01 && Math.abs(largeBlock.v) < 0.01) {
//     // Optionally stop the simulation when blocks nearly stop
//     // running = false;
//     // startBtn.removeAttribute('disabled');
//     // pauseBtn.attribute('disabled', '');
//   }
// }