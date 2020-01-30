
  let vMax;

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
