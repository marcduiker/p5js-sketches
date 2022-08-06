const darkColor = 20;
const lightColor = 240;
class Cell {
    constructor(x, y, isDead) {
        this.x = x;
        this.y = y;
        this.isDead = isDead ?? true;
    }

    draw() {
        stroke(90);
        if (this.isDead) {
            fill(darkColor);
        } else {
            fill(lightColor);
        }
        rect(this.x * cellWidth, this.y * cellHeight, cellWidth, cellHeight);
    }

    getNewState(neighbors) {
        // Any live cell with fewer than two live neighbours dies, as if by underpopulation.
        // Any live cell with two or three live neighbours lives on to the next generation.
        // Any live cell with more than three live neighbours dies, as if by overpopulation.
        // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
        if (!this.isDead && (neighbors.length < 2 || neighbors.length > 3)) {
            return new Cell(this.x, this.x, true);
        } else if (this.isDead && neighbors.length === 3) {
            return new Cell(this.x, this.x, false);
        }
    }
}