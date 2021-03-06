let vertices = [],
  pressureStore = [],
  brush = [];
// brush mechanics
let dx, dy;
//time delay
let milliCounter, milliTrack = 0;
//colour variables
let colHue, colSat, colBri, colOpacity = 0.4,
  colourBool = 0;
// domain for randomisation
let r1 = -3,
  r2 = 8,
  smallestBrush = 0.3,
  largestBrush = 1.5;
let brushTimeout = 30,
  elapsedTime = 0;

let brushRandomiser = 0;
let autoX = 0,
  autoY = 0,
  pautoX = 0,
  pautoY = 0;

// global mouse track
let isMousedown = 0;

// colour variables
let cloudHSB = [
  [180, 47, 25],
  [178, 23, 55],
  [170, 15, 75],
  [164, 12, 95],
  [176, 45, 19]
];

let sunsetHSB = [
  [11, 53, 96],
  [13, 83, 91],
  [2, 90, 100],
  [334, 81, 91],
  [300, 67, 99]
];
let vMax;

// intro variables
let introText = ["Touchez et Ecoutez", "Regardez", "Dessinez"];
let appCol = "#e3495d";
let slide = 0,
  delayTime = 13000,
  introState = 0,
  startButton;

//DATA
let pointStore;
let lineStore;


function preload() {
  bg = loadImage('assets/paper.jpg');
  for (let i = 1; i < 21; i++) {
    brush[i] = loadImage('assets/br-' + i + '.png')
  }
  audio = loadSound('assets/audio_1.mp3');
  click = loadSound('assets/click.mp3');
}

function setup() {

  // make canvas and create all Layers
  createCanvas(windowWidth, windowHeight);
  textLayer = createGraphics(width, height);
  paintLayer = createGraphics(width, height);
  autoLayer = createGraphics(width, height);
  textLayer = createGraphics(width, height);
  calcDimensions();

  // aesthetics, and uniform colour paramaters
  pixelDensity(1);
  imageMode(CENTER);
  blendMode(BLEND);
  colorMode(HSB, 360, 100, 100, 1);
  paintLayer.colorMode(HSB, 360, 100, 100);
  autoLayer.colorMode(HSB, 360, 100, 100);
  colHue = random(360);
  colSat = random(255);
  autobrushQuality();

  // backing colours
  backdrop();
  autoLayer.background(appCol);

  // begin slideshow
  slide = 0;
  slideShow();

  // all event listeners
  canvas.addEventListener('touchmove', moved);
  canvas.addEventListener('mousemove', moved);
  canvas.addEventListener('touchstart', touchdown);
  canvas.addEventListener('mousedown', touchdown);
  canvas.addEventListener('touchend', touchstop);
  canvas.addEventListener('touchleave', touchstop);
  canvas.addEventListener('mouseup', touchstop);

  //DATA
  pointStore = [];
  lineStore = [];
}

function touchdown(ev) {

  isMousedown = 1;
  if (slide === 0) {
    startUp();
  }

  paintLayer.strokeWeight(40);
  paintLayer.stroke(255, 0, 255, 0.075);
  paintLayer.strokeJoin(ROUND);
  paintLayer.noFill();
  vertices[0] = [];
  vertices[1] = [];
  pressureStore = [];
  return false;
}


function startUp() {
  click.play();
  startButton.remove();
  slide++;
  if (audio.isPlaying()) {} else {
    audio.loop(0);
  }
  slideShow();
}

function backdrop() {
  noTint();
  image(bg, width / 2, height / 2, width, height);
}

function brushQuality(_x, _y) {
  brushRandomiser = int(random(1, 20));
  let swatchTemp = int(random(0, 5));
  if (colourBool) {
    colHue = cloudHSB[swatchTemp][0];
    colSat = cloudHSB[swatchTemp][1];
    colBri = cloudHSB[swatchTemp][2];
  } else {
    colHue = sunsetHSB[swatchTemp][0];
    colSat = sunsetHSB[swatchTemp][1];
    colBri = sunsetHSB[swatchTemp][2];
  }
}

function autoCopy() {
  paintLayer.copy(autoLayer, 0, 0, width, height, 0, 0, width, height);
}

function draw() {
  if (millis() - elapsedTime > brushTimeout) {
    autoDraw();
    elapsedTime = millis();
  }
  if (introState === 3) {
    backdrop();
    blendMode(DARKEST);
    image(paintLayer, width / 2, height / 2);
    blendMode(BLEND);
    image(textLayer, width / 2, height / 2);
  } else {
    blendMode(BLEND);
    background(352, 68, 89, 100);
    if (slide > 0) {
      textLayer.text(introText[slide - 1], width / 2, (height / 3) * (slide - 1));
    }
    imageMode(CORNER)
    image(autoLayer, 0, 0, width, height);
    image(textLayer, 0, 0, width, height);
  }
}

function autobrushQuality() {
  brushQuality();
  setTimeout(autobrushQuality, 2000);
}

function touchstop(ev) {
  isMousedown = 0;

  if (introComplete) {
    lineStore.push(pointStore);
    pointStore = [];
  }

}

function moved(ev) {
  ev.preventDefault();
  if (!isMousedown) return;

  if (introState < 3) {
    makeDrawing(mouseX, mouseY, pmouseX, pmouseY);
  } else {
    vertices[0].push(mouseX);
    vertices[1].push(mouseY);
    pressureStore.push(getPressure(ev));
    paintLayer.beginShape();

    //DATA
    pressure = getPressure(ev);
    pointStore.push({
      time: new Date().getTime(),
      x: mouseX,
      y: mouseY,
      pressure: pressure
    });

    for (let i = 0; i < vertices[0].length; i++) {

      // To enable pressure sensitivity feedback in line-weight, enable below.
      // if ((i % 4) === 0) {
      //   paintLayer.curveVertex(vertices[0][i], vertices[1][i]);
      //   paintLayer.endShape();
      //   paintLayer.strokeWeight(pressureStore[i] * 40)
      //   paintLayer.beginShape();
      //   paintLayer.curveVertex(vertices[0][i - 2], vertices[1][i - 2])
      //   paintLayer.curveVertex(vertices[0][i - 1], vertices[1][i - 1])
      // }

      paintLayer.curveVertex(vertices[0][i], vertices[1][i]);
    }
    paintLayer.endShape();
  }
  return false;
}

function autoDraw() {
  let _a = 1.2;
  pautoX = autoX;
  pautoY = autoY;
  autoX = autoX + (random(r1 * _a, r2 * _a));
  autoY = autoY + (random(r1, r2));
  makeDrawing(autoX % width, autoY % height, pautoX % width, pautoY % height);
}

function makeDrawing(_x, _y, pX, pY) {
  const rotDrift = 0.2
  var angle1 = atan2(dy, dx) + (random(-rotDrift, rotDrift));
  var segLength = width / 40;
  let milliComp = 5;
  let tempX = 100;
  let tempY = 100;
  milliCounter = millis();
  if (milliCounter > milliTrack + milliComp) {
    if (colSat < 10) {
      colSat += 30
    }
    dx = _x - tempX;
    dy = _y - tempY;
    tempX = _x - (cos(angle1) * segLength / 2);
    tempY = _y - (sin(angle1) * segLength / 2);
    let scalar = constrain(300 * (random(3, abs(_x - pX)) / width), smallestBrush, largestBrush);
    segment(tempX, tempY, angle1, brush[brushRandomiser], scalar)
    milliTrack = milliCounter;
  }
}

function segment(rakeX, rakeY, a, rake, scalar) {
  const hueDrift = 3,
    satDrift = 3;
  const scatterAmount = 2;
  autoLayer.tint((colHue += random(-hueDrift, hueDrift)), (colSat += random(-satDrift, satDrift)), colBri, colOpacity); // Display at half opacity
  autoLayer.push();
  autoLayer.imageMode(CENTER); // centers loaded brushes
  autoLayer.translate(rakeX + (randomGaussian(-scatterAmount * (0.1 * scalar), scatterAmount * (0.1 * scalar))), rakeY + (randomGaussian(-scatterAmount * (0.1 * scalar), scatterAmount * (0.1 * scalar))));
  autoLayer.scale(scalar);
  autoLayer.rotate(a);
  autoLayer.image(rake, 0, 0, 0, 0);
  autoLayer.imageMode(CORNER); // centers loaded brushes
  autoLayer.pop();
}

function reset() {
  paintLayer.clear();
  colourBool = !colourBool;
  brushQuality();
  console.log(colourBool);
  autoCopy();
}

function windowResized() {
  resizeCanvas(width, height);
  backdrop();
  textLayer.resizeCanvas(width, height);
  //paintLayer.resizeCanvas(width, height);
  //autoLayer.resizeCanvas(width, height);
  autoCopy();
  calcDimensions();
  if (introState === 3) {
    removeElements();
    writeTextUI();
  }
}

getPressure = function (ev) {
  return ((ev.touches && ev.touches[0] && typeof ev.touches[0]["force"] !== "undefined") ? ev.touches[0]["force"] : 1.0);
}
