let introText = ["Touchez et Ecoutez", "Regardez", "Dessinez"];
let appCol = "#f1b300";
let slide = 0;
let delayTime = 13000;
let introState = 0;
let startButton;





function slideShow() {

  if (slide === 0){
    background(241, 181, 0); // change for these app colours
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
