const SIDE_LENGTH = 20;
const SQRT_2 = Math.sqrt(2);

class LToothpick {  
  centreX = 0;
  centreY = 0;
  ax = 0;
  ay = 0;
  bx = 0;
  by = 0;
  parentPointingTo = 0;
  freeEdges = [];
  overlapArray = [];

  //45 -> y-ve x+ve
  //135 -> y-ve x-ve
  //225 -> y+ve x-ve
  //315 ->  y+ve x+ve

  constructor(x, y, parentPointingTo, isLarge) {
    this.centreX = x;
    this.centreY = y;
    this.parentPointingTo = parentPointingTo;
    let aPointingTo = this.parentPointingTo + 45,
      bPointingTo = this.parentPointingTo - 45;

    let a, b;
    if (isLarge) {
      a = p5.Vector.fromAngle(radians(aPointingTo), SIDE_LENGTH * SQRT_2);

      b = p5.Vector.fromAngle(radians(bPointingTo), SIDE_LENGTH * SQRT_2);
    } else {
      a = p5.Vector.fromAngle(radians(aPointingTo), SIDE_LENGTH);
      b = p5.Vector.fromAngle(radians(bPointingTo), SIDE_LENGTH);
    }

    this.ax = this.centreX + a.x;
    this.ay = this.centreY + a.y;
    this.bx = this.centreX + b.x;
    this.by = this.centreY + b.y;

    this.freeEdges = [
      { x: this.ax, y: this.ay, pointingTo: aPointingTo },
      { x: this.bx, y: this.by, pointingTo: bPointingTo }
    ];
  }

  draw() {
    stroke(255);
    line(this.centreX, this.centreY, this.ax, this.ay);
    line(this.centreX, this.centreY, this.bx, this.by);
    for (let freeEdge of this.freeEdges) {
      fill(255);
      ellipse(freeEdge.x, freeEdge.y, 5);
    }
  }

  hasBeenVisited() {
    this.freeEdges = [];
  }

  overlapsWithOthers(otherToothpicks) {
    let overlaps = false;
    this.overlapArray = [];
    for (let otherToothpick of otherToothpicks) {
      const aIntersectsWithOtherA = this.checkIntersectionWithOtherLine(
        this.centreX,
        this.centreY,
        this.ax,
        this.ay,
        otherToothpick.centreX,
        otherToothpick.centreY,
        otherToothpick.ax,
        otherToothpick.ay,
        this.overlapArray
      );
      const aIntersectsWithOtherB = this.checkIntersectionWithOtherLine(
        this.centreX,
        this.centreY,
        this.ax,
        this.ay,
        otherToothpick.centreX,
        otherToothpick.centreY,
        otherToothpick.bx,
        otherToothpick.by,
        this.overlapArray
      );

      const bIntersectsWithOtherA = this.checkIntersectionWithOtherLine(
        this.centreX,
        this.centreY,
        this.bx,
        this.by,
        otherToothpick.centreX,
        otherToothpick.centreY,
        otherToothpick.ax,
        otherToothpick.ay,
        this.overlapArray
      );

      const bIntersectsWithOtherB = this.checkIntersectionWithOtherLine(
        this.centreX,
        this.centreY,
        this.bx,
        this.by,
        otherToothpick.centreX,
        otherToothpick.centreY,
        otherToothpick.bx,
        otherToothpick.by,
        this.overlapArray
      );

      if (
        aIntersectsWithOtherA ||
        aIntersectsWithOtherB ||
        bIntersectsWithOtherA ||
        bIntersectsWithOtherB
      ) {
        overlaps = true;
        break;
      }
    }

    return overlaps;
  }

  checkIntersectionWithOtherLine(x1, y1, x2, y2, x3, y3, x4, y4) {
    const tempArray = [x1, y1, x2, y2, x3, y3, x4, y4].map(item =>
      Math.round(item)
    );

    [x1, y1, x2, y2, x3, y3, x4, y4] = tempArray;

    const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    const num = -1 * ((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3));

    if (
      (x1 === x3 && y1 === y3 && x2 === x4 && y2 === y4) ||
      (x1 === x4 && y1 === y4 && x2 === x3 && y2 === y3)
    ) {
      return true;
    }
    if (den === 0) return false;

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
    const u = num / den;

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      const px = x1 + t * (x2 - x1);
      const py = y1 + t * (y2 - y1);
      if (
        (px === x1 && py === y1) ||
        (px === x2 && py === y2) ||
        (px === x3 && py === y3) ||
        (px === x4 && py === y4)
      ) {
        // if (this.overlapArray.find(item => console.log(item)) == null) {
        //   this.overlapArray.push({ x: px, y: py });
        //   console.log(this.overlapArray);
        //   return false;
        // } else return true;
        return false;
      } else {
        return true;
      }
    }

    return false;
  }
  getFreeEdges() {
    return this.freeEdges;
  }
}
