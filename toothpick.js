class Toothpick {
  x1 = 0;
  y1 = 0;
  x2 = 0;
  y2 = 0;
  freeEdges = [];
  constructor(x1, y1, x2, y2) {
    this.x1 = x1;
    (this.x2 = x2), (this.y1 = y1);
    this.y2 = y2;
    this.freeEdges = [[this.x1, this.y1], [this.x2, this.y2]];
  }

  draw() {
    line(this.x1, this.y1, this.x2, this.y2);
  }

  getFreeEdges() {
    return this.freeEdges;
  }

  removeFreeEdge(x, y) {
    const index = this.freeEdges.indexOf([x, y]);
    this.freeEdges = this.freeEdges.splice(index, 1);
  }
}
