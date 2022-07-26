// Wave Function Collapse (tiled model)
// https://thecodingtrain.com/challenges/171-wave-function-collapse
// https://youtu.be/0zac-cDzJwA

class Cell {
    constructor(value) {
      this.collapsed = false;

      if (value instanceof Array) {
        this.options = value;
      } else {
        // or all options to start
        this.options = [];
        for (let i = 0; i < value; i++) {
          this.options[i] = i;
        }
      }

      this.entropy = this.options.length;
    }
  }
  