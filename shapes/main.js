let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;

/**
 * I couldn't get this working
 * in a reasonable amount of time.
 *
 * :'(
*/

// const CELL_SIZE = 30;
// const ROWS = Math.floor(canvasWidth / CELL_SIZE);
// const COLUMNS = Math.floor(canvasHeight / CELL_SIZE);
// const cells = [];
//
// class Cell {
//   constructor(row, column) {
//     this.row = row;
//     this.column = column;
//     this.isAlive = Math.random() > 0.5;
//   }
//
//   // get isAlive() {
//   //   return this.isAlive;
//   // }
//
//   // set isAlive(isAlive) {
//   //   this.isAlive = isAlive;
//   // }
//
//   draw() {
//     this.isAlive ? fill(0) : fill(255);
//     square(
//       this.row * CELL_SIZE,
//       this.column * CELL_SIZE,
//       CELL_SIZE
//     );
//   }
// }
//  /**
//    Conway's Game of Life
//    https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life
//  */
//
// function setup() {
//   createCanvas(canvasWidth, canvasHeight);
//   background(200);
//   frameRate(1);
//
//   for (let row = 0; row < ROWS; row++) {
//     cells.push([]);
//     for (let column = 0; column < COLUMNS; column++) {
//       const cell = new Cell(row, column);
//       cells[row].push(cell);
//     }
//   }
// }
//
// function draw() {
//   cells.forEach((row) => {
//     row.forEach((cell) => {
//       cell.draw();
//
//       let neighbors = 0;
//       for (let row = Math.max(0, cell.row - 1); row < Math.min(cell.row + 1, cells.length); row++) {
//         for (let column = Math.max(0, cell.column - 1); column < Math.min(cell.column + 1, cells[row].length); column++) {
//           if (cells[row][column].isAlive) {
//             neighbors++;
//           }
//         }
//       }
//
//       cell.isAlive && neighbors--;
//
//       cell.isAlive ? fill(255) : fill(0);
//       text(neighbors, cell.row * CELL_SIZE, cell.column * CELL_SIZE);
//
//       if (cell.isAlive) {
//         cell.isAlive = neighbors < 2 || neighbors > 3;
//       } else {
//         cell.isAlive = neighbors == 3;
//       }
//
//     });
//   });
// }

// in p5.js, the function runs on page load:
function setup() {
  createCanvas(canvasWidth, canvasHeight);

  // invoke any drawing functions inside of setup.
  // functions should all go between "createCanvas()" and "drawGrid()"
  // draw5RedSquares();
  drawNShapesDirectionFlexible(10, 100, 100, 50, "circle", "row")
  drawGrid(canvasWidth, canvasHeight);
}

// my first function
function draw5Circles() {
  noFill();
  // fill('red');
  circle(100, 200, 50); // centerX, centerY, radius
  circle(100, 250, 50);
  circle(100, 300, 50);
  circle(100, 350, 50);
  circle(100, 400, 50);
}

function draw5RedSquares() {
  fill("red");
  square(320, 200, 50); // topLeftX, topLeftY, width
  square(320, 250, 50);
  square(320, 300, 50);
  square(320, 350, 50);
  square(320, 400, 50);
}

function draw5CirclesWhile() {
  let i = 0;
  while (i < 5) {
    circle(100, 200 + (50 * i), 50);
    i++;
  }
}

function draw5CirclesFor() {
  for (let i = 0; i < 5; i++) {
    circle(100, 200 + (50 * i), 50);
  }
}

function drawNCircles(n) {
  for (let i = 0; i < n; i++) {
    circle(100, 200 + (50 * i), 50);
  }
}

function drawNCirclesFlexible(n, size, x, y) {
  for (let i = 0; i < n; i++) {
    circle(x, y + (size * i), size);
  }
}

function drawNShapesFlexible(n, size, x, y, shape = "circle") {
  const args = [n, size, x, y];
  const drawShapes = (n, size, x, y, shapeFn) => {
    for (let i = 0; i < n; i++) {
      shapeFn(x, y + (size * i), size);
    }
  }

  switch (shape) {
    case "circle":
      drawShapes(...args, circle);
      break;
    case "square":
      drawShapes(...args, square);
      break;
    default:
      console.error("Invalid shape passed to drawNShapesFlexible call.");
      break;
  }
}

function drawNShapesDirectionFlexible(n, size, x, y, shape = "circle", direction = "column") {
  const args = [n, size, x, y];
  const drawShapes = (n, size, x, y, shapeFn, direction) => {
    switch (direction) {
      case "column":
        for (let i = 0; i < n; i++) {
          shapeFn(x, y + (size * i), size);
        }
        break;
      case "row":
        for (let i = 0; i < n; i++) {
          shapeFn(x + (size * i), y, size);
        }
        break;
      default:
        console.error("Invalid direction passed to drawNShapesDirectionFlexible.");
        break;
    }
  }

  switch (shape) {
    case "circle":
      drawShapes(...args, circle, direction);
      break;
    case "square":
      drawShapes(...args, square, direction);
      break;
    default:
      console.error("Invalid shape passed to drawNShapesDirectionFLexible.");
      break;
  }
}
