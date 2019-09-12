let lToothpicks = [],
  n = 1,
  minX,
  maxX,
  maxY,
  minY;

function setup() {
  createCanvas(windowWidth, windowHeight);
  minX = -width / 2;
  maxX = width / 2;
  minY = -height / 2;
  maxY = height / 2;
  const lToothpick = new LToothpick(0, 0, 270, n % 2 === 1);
  lToothpicks.push(lToothpick);
}

function addToothpicks() {
  n++;
  const newToothpickArray = [];
  for (let toothpick of lToothpicks) {
    for (let { x, y, pointingTo } of toothpick.getFreeEdges()) {
      newToothpickArray.push(new LToothpick(x, y, pointingTo, n % 2 === 1));
    }
    toothpick.hasBeenVisited();
  }

  const finalArray = [];

  for (let i = 0; i < newToothpickArray.length; i++) {
    const toothpick = newToothpickArray[i];
    const duplicates = newToothpickArray.filter(
      item =>
        Math.round(item.centreX) == Math.round(toothpick.centreX) &&
        Math.round(item.centreY) == Math.round(toothpick.centreY)
    );
    if (duplicates.length === 1) {
      finalArray.push(toothpick);
    }
  }

  for (let i = 0; i < finalArray.length; i++) {
    const toothpick = finalArray[i];
    const otherToothpicks = finalArray
      .slice(0, i)
      .concat(finalArray.slice(i + 1, finalArray.length), lToothpicks);
    const overlaps = toothpick.overlapsWithOthers(otherToothpicks);
    if (!overlaps) {
      lToothpicks.push(toothpick);
    }
  }
}

function mouseClicked() {
  addToothpicks();
}

function draw() {
  background(0);
  push();
  translate(width / 2, height / 2);
  const factorW = (width - 80) / (maxX - minX);
  const factorH = (height - 80) / (maxX - minX);

  scale(factorH < factorW ? factorH : factorW);
  for (let toothpick of lToothpicks) {
    toothpick.draw();
    minX = min(minX, min(toothpick.bx, toothpick.ax));
    maxX = max(maxX, max(toothpick.bx, toothpick.ax));
    minY = min(minY, min(toothpick.by, toothpick.ay));
    maxY = max(maxY, max(toothpick.by, toothpick.bx));
  }
  pop();
  translate(width - 16 * 9, 0);
  textSize(16);
  fill(255);
  text(`Iteration = ${n}`, 10, 30);
}
