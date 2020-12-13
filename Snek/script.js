// ------------CONSTANTS------------------

// board set up
const snakeBoard = document.getElementById("gameCanvas")
const boardContext = snakeBoard.getContext("2d")
const boardBorder = 'black'
const boardBackground = 'white'

// making the snake, the snake below starts at y pos = 200 and is 50 px long
let snake = [
  {x: 200, y: 200},
  {x: 190, y: 200},
  {x: 180, y: 200},
  {x: 170, y: 200},
  {x: 160, y: 200},
  ];
const snake_color = 'red'
const snake_outline = 'black'

const foodColor = 'yellow'
const foodOutline = 'black'

// initializing
let score = 0
// horizontal velocity
let vel_x = 10;
let foodX;
let foodY;
// vertical velocity
let vel_y = 0;
// for turning the snake
let direction_change = false

// starts the game with click of button
const startButton = document.getElementById("startButton")
startButton.addEventListener("click", function() {
  main();
  spawnFood();

  startButton.style.display = "none"
  document.getElementById("scoreLabel").style.display = "block"
  document.getElementById("score").style.display = "block"
});
//clearBoard();
document.addEventListener("keydown", turn);

// ------------FUNCTIONS------------------

// main function
function main() {
  if (gameOver()) {
    startButton.style.display = "inline-block"
    document.getElementById("scoreLabel").style.display = "none"
    document.getElementById("score").style.display = "none"
    
    window.alert("Game Over! Your final score is: " + score)
    return;
  }
  direction_change = false;

  setTimeout(function onTick() {
    clearBoard();
    drawFood();
    moveSnake();
    drawSnake();

    // repeat
    main();
  }, 100)

}

// clears the board
function clearBoard() {
  boardContext.fillStyle = boardBackground;
  boardContext.strokeStyle = boardBorder;

  // fills in a rectangle for background
  boardContext.fillRect(0, 0, snakeBoard.width, snakeBoard.height);
  // draws a border around the background rectangle
  boardContext.strokeRect(0, 0, snakeBoard.width, snakeBoard.height);
}

function gameOver() {
  // case 1: snake's head collides with its body
  for (var i = 4; i < snake.length; i++) {
    if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) return true;
  }

  // case 2: snake hits the wall
  let hitLeft = snake[0].x < 0;
  let hitRight = snake[0].x > snakeBoard.width - 10
  let hitUp = snake[0].y < 0;
  let hitDown = snake[0].y > snakeBoard.height - 10

  return hitLeft || hitRight || hitUp || hitDown
}

// draws the snake
function drawSnake() {
  snake.forEach(drawSnakePart);
}
function drawSnakePart(snakePart) {
  boardContext.fillStyle = snake_color
  boardContext.strokeStyle = snake_outline

  boardContext.fillRect(snakePart.x, snakePart.y, 10, 10);
  boardContext.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

// snake movements
function moveSnake() {
  let newHead = {x: snake[0].x + vel_x, y: snake[0].y + vel_y}
  // unshift() adds one or more elements to the beginning of an array, so
  // we're using it to create the snake's new head
  snake.unshift(newHead)

  // checking if the snake is growing by its head eating food
  const hasEaten = snake[0].x === foodX && snake[0].y === foodY;
  if (hasEaten) {
    // // increase the score
    // score++;
    // display the new score
    document.getElementById("score").innerHTML = ++score

    // grows the snake by NOT deleting its tail
    spawnFood();
  } else {
    // deleting the snake's tail with pop()
    snake.pop()
  }
}
function turn(event) {
  // some key codes for the arrow keys
  const LEFT_KEY = 37
  const UP_KEY = 38
  const RIGHT_KEY = 39
  const DOWN_KEY = 40

  const directionKey = event.keyCode

  // prevents the snake reversing
  if (direction_change) return;
  direction_change = true;

  // booleans to check the snake's current movement
  const goingUp = vel_y === -10;
  const goingDown = vel_y === 10;
  const goingRight = vel_x === 10;
  const goingLeft = vel_x === -10;

  if (directionKey === LEFT_KEY && !goingRight) {
    vel_x = -10;
    vel_y = 0;
  }
  if (directionKey === UP_KEY && !goingDown) {
    vel_x = 0;
    vel_y = -10;
  }
  if (directionKey === RIGHT_KEY && !goingLeft) {
    vel_x = 10;
    vel_y = 0;
  }
  if (directionKey === DOWN_KEY && !goingUp) {
    vel_x = 0;
    vel_y = 10;
  }
}

// food for the snake
function spawnFood() {
  // randomize x and y coordinates for food to spawn
  foodX = Math.round((Math.random() * (snakeBoard.width - 10)) / 10) * 10;
  foodY = Math.round((Math.random() * (snakeBoard.height - 10)) / 10) * 10;

  // check if any part of the snake touches the food
  snake.forEach(function checkEaten(part) {
    const hasEaten = part.x == foodX && part.y == foodY;
    if (hasEaten) spawnFood();  // if it ate the food, spawn a new one
  })
}
function drawFood() {
  boardContext.fillStyle = foodColor
  boardContext.strokeStyle = foodOutline
  boardContext.fillRect(foodX, foodY, 10, 10);
  boardContext.strokeRect(foodX, foodY, 10, 10);
}
