import { SnakeBodyCell, Snake, Food } from "./tableObjects.js";

const MAX_DIFFICULTY = 6;

//general game variables
var snakes = []
var playerOneSnake;
var playerTwoSnake;
var isPaused = false;
var table = null;
var pieceOfFood;
var snakeBody = [];
var intervalClock;
var currentDirection = Snake.RIGHT;

const ZERO = 0;
var tableRows;
var tableColumns;
var difficulty = 3;

//event listeners
document.addEventListener('keydown', changePlayerOneDirection);
function changePlayerOneDirection(event) {
    // Check if the pressed key is an arrow key
    if (event.key.startsWith('Arrow')) {
        event.preventDefault(); // Prevent default scrolling behavior
    } 
    if(playerOneSnake.directionSetForFrame) return;
    if (event.key === 'ArrowLeft' && playerOneSnake.direction != Snake.RIGHT)
        playerOneSnake.direction = Snake.LEFT;
    else if (event.key === 'ArrowUp' && playerOneSnake.direction != Snake.DOWN)
        playerOneSnake.direction = Snake.UP;
    else if (event.key === 'ArrowRight' && playerOneSnake.direction != Snake.LEFT)
        playerOneSnake.direction = Snake.RIGHT;
    else if (event.key === 'ArrowDown' && playerOneSnake.direction != Snake.UP)
        playerOneSnake.direction = Snake.DOWN;
    playerOneSnake.directionSetForFrame = true;
}

//event listeners
document.addEventListener('keydown', changePlayerTwoDirection);
function changePlayerTwoDirection(event) {
    // Check if the pressed key is an arrow key
    if (event.key.startsWith('Arrow')) {
        event.preventDefault(); // Prevent default scrolling behavior
    } 
    if(playerTwoSnake.directionSetForFrame) return;
    if (event.key === 'a' && playerTwoSnake.direction != Snake.RIGHT)
        playerTwoSnake.direction = Snake.LEFT;
    else if (event.key === 'w' && playerTwoSnake.direction != Snake.DOWN)
        playerTwoSnake.direction = Snake.UP;
    else if (event.key === 'd' && playerTwoSnake.direction != Snake.LEFT)
        playerTwoSnake.direction = Snake.RIGHT;
    else if (event.key === 's' && playerTwoSnake.direction != Snake.UP)
        playerTwoSnake.direction = Snake.DOWN;
    directionSetForFrame = true;
}

function initializeSnakeGame(rows, columns) {
    //remove the start game button
    var startGameButtom = document.getElementById("startGameButton");
    startGameButtom.remove();

    initializeTable(rows, columns);

    //initialize two player snake game
    initializeSnake(1, 'snake-cell');
    initializeSnake(2, 'snake-cell-two');

    unpauseGame();
}

function initializeSnake(id, classStyleName) {
    var snake = new Snake(id, classStyleName);
    var initialBodyCell = new SnakeBodyCell();
    placeObjectRandomlyOnTable(initialBodyCell);
    snake.body.push(initialBodyCell);
    snakes.push(snake);
    snakeBody = snake.body;

    if(id == 1) {
        playerOneSnake = snake;
    } else if(id == 2) {
        playerTwoSnake = snake;
    }
    
}

function initializeTable(rows, columns) {
    //make it so the table can't be too small
    tableRows = Math.max(8, rows);
    tableColumns = Math.max(20, columns);

    //initialize the table
    table = document.createElement("table");
    table.classList.add("snake-table");

    //nested loop to create rows and columns for the table
    for(var i = 0; i < tableRows; i++) {
        var row = document.createElement("tr");

        for(var j = 0; j < tableColumns; j++) {
            var cell = document.createElement("td");
            cell.classList.add("empty-cell");
            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    //add the table to the html
    var tableContainer = document.getElementById("snakeGameTable");
    tableContainer.appendChild(table);
}

function updateSnakeGame() {
    //updateSnakeCells("empty-cell");
    checkGame();
    //updateSnakeCells("snake-cell");

    //update the divs here
    //document.getElementById("scoreData").textContent = snakeBody.length;
    //document.getElementById("difficulty").textContent = difficulty.toString();
}

//update this so that it 
function placeObjectRandomlyOnTable(object) {
    var randomRow;
    var randomColumn;

    var emptyCell = false;
    while(emptyCell == false){
        randomRow = getRandomIntegerInRange(0, tableRows);
        randomColumn = getRandomIntegerInRange(0, tableColumns);

        emptyCell = isEmptyCell(randomRow, randomColumn);
    }

    changeCellClass(randomRow, randomColumn, object.classStyleName);
    object.row = randomRow;
    object.column = randomColumn;
}

function getRandomIntegerInRange(min, max) {
    var randomNumber = Math.random();
    var randomNumberScaled = randomNumber * max + min;
    return Math.floor(randomNumberScaled);
}

function changeCellClass(row, column, newClass) {
    if (!table)
        return;

    var rows = table.getElementsByTagName("tr");
    if (row < rows.length) {
        var cells = rows[row].getElementsByTagName("td");
        if (column < cells.length) {
            cells[column].className = newClass;
        }
    }
}

function checkGame() {
    for(var i = 0; i < snakes.length; i++) {
        snakes[i].directionSetForFrame = false;
        var currHeadRow = snakes[i].body[0].row;
        var currHeadColumn = snakes[i].body[0].column;
        var cutTail = true;
        //if the food was eaten, make a new piece
        if(pieceOfFood == null){
            pieceOfFood = new Food();
            placeObjectRandomlyOnTable(pieceOfFood);
            increaseGameSpeed(0.1);
        }
        if(currHeadRow == pieceOfFood.row && currHeadColumn == pieceOfFood.column){
            pieceOfFood = null;
            cutTail =  false;
        }

        switch (snakes[i].direction) {
            case Snake.LEFT:
                currHeadColumn = currHeadColumn - 1;
                break;
            case Snake.UP:
                currHeadRow = currHeadRow - 1;
                break;
            case Snake.RIGHT:
                currHeadColumn = currHeadColumn + 1;
                break;
            case Snake.DOWN:
                currHeadRow = currHeadRow + 1;
                break;
        }
        if(currHeadColumn < ZERO) {
            currHeadColumn = tableColumns - 1;
        }
        else if(currHeadColumn > tableColumns - 1) {
            currHeadColumn = 0;
        }
        else if(currHeadRow < ZERO) {
            currHeadRow = tableRows - 1;
        }
        else if(currHeadRow > tableRows - 1) {
            currHeadRow = 0;
        }

        var classList = getCellClassList(currHeadRow, currHeadColumn);
        if(snakes[i].id == 1) {
            console.log(classList);
        }
        
        if(!getCellClassList(currHeadRow, currHeadColumn).contains("empty-cell") &&
           !getCellClassList(currHeadRow, currHeadColumn).contains("food-cell")) {
            snakes[i].isAlive = false;
            continue;
        }

        updateIndividualSnakeCells(snakes[i], 'empty-cell');
        
        var bodyPart = new SnakeBodyCell(currHeadRow, currHeadColumn);
        snakes[i].body.unshift(bodyPart);

        if(cutTail)
            snakes[i].body.pop();

        updateIndividualSnakeCells(snakes[i]);
    }
    removeDeadSnakes();
}

function removeDeadSnakes() {
    for(var i = 0; i < snakes.length; i++) {
        if(snakes[i].isAlive) continue;
        updateIndividualSnakeCells(snakes[i], 'empty-cell');
        
        var index = snakes.indexOf(snakes[i]);
        if (index !== -1) {
            snakes.splice(index, 1); // Remove one element at the found index
        }
        
    }
    
}

function updateSnakeCells(cellClass) {
    for(var i = 0; i < snakeBody.length; i++) {
        changeCellClass(snakeBody[i].row, snakeBody[i].column, cellClass);
    }
}

function updateIndividualSnakeCells(snake, cellClass = snake.classStyleName) {
    for(var i = 0; i < snake.body.length; i++) {
        changeCellClass(snake.body[i].row, snake.body[i].column, cellClass);
    }
}

function pauseGameToggle() {
    if(isPaused) unpauseGame();
    else pauseGame();
}

function unpauseGame() {
    //update the game every fourth of a second divided by the difficulty
    intervalClock = setInterval(updateSnakeGame, 250 / difficulty);
    isPaused = false;
}

function pauseGame() {
    clearInterval(intervalClock);
    isPaused = true;
}

function increaseGameSpeed(additionalDifficulty) {
    difficulty = Math.min(difficulty + additionalDifficulty, MAX_DIFFICULTY);
    clearInterval(intervalClock);
    intervalClock = setInterval(updateSnakeGame, 250 / difficulty);
}

function isEmptyCell(row, column) {
    var rows = table.getElementsByTagName("tr");
    if (row < rows.length) {
      var cells = rows[row].getElementsByTagName("td");
      if (column < cells.length) {
        return cells[column].classList.contains("empty-cell");
      }
    }
  
    return false;
}

function getCellClassList(row, column) {
    var rows = table.getElementsByTagName("tr");
    if (row < rows.length) {
      var cells = rows[row].getElementsByTagName("td");
      if (column < cells.length) {
        return cells[column].classList;
      }
    }
}

document.getElementById("startGameButton").addEventListener("click", function() {
    initializeSnakeGame(40, 60);
});

document.getElementById("pauseGameButton").addEventListener("click", function() {
    pauseGameToggle();
});