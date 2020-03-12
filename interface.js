  function slideShow() {

    if (slide === 0){
      background(appCol); // change for these app colours
      startButton = createButton(introText[0]);
      startButton.class("startButton");
      startButton.position((width / 2) - (20 * vMax), (height / 2) - (4 * vMax));
      startButton.mousePressed(startUp);
    }

    if (slide === introText.length) {
      textLayer.remove();
      introState = 3;
      writeTextUI();
      imageMode(CENTER)
      textLayer.clear();
      r1 = -60;
      r2 = 100;
      smallestBrush = 0.1;
      largestBrush = 0.7;
      colOpacity = 0.4;
      autoCopy();


      slide = 4;
      counter = 0;
    }

    else if (slide < introText.length && slide > 0) {

      textLayer.clear();
      textLayer.fill(255, 5);
      textLayer.textSize(vMax*7);
      textLayer.textAlign(CENTER, CENTER);
      textLayer.rectMode(CENTER);


  if (slide > 0){

  if (slide === introText.length-1){
    delayTime = 13000;
  }

        slide++;
          setTimeout(slideShow, delayTime);
  }

    }
  }




  function calcDimensions() {
    vW = width / 100;
    if (width > height) {
      vMax = width / 100;
    } else {
      vMax = height / 100;
    }
  }

  function writeTextUI() {
    textSize(windowWidth / 50);
    fill(0);
    noStroke();
    resetButton = createButton("Suivant");
    resetButton.class("select");
    resetButton.style('font-size', '1.7vmax');
    resetButton.style('height', '5vmax');
    resetButton.position(width - (16 * vMax), height - (6.5 * vMax));
    resetButton.mousePressed(reset);
  }
