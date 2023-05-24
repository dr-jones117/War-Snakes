//movement directions
const UP = 'up';
const RIGHT = 'right';
const DOWN = 'down';
const LEFT = 'left';

//general game variables
var isPaused = false;
var table = null;
var pieceOfFood = null;
var snakeBody = [];
var intervalClock;
var currentDirection = RIGHT;
var tableRows;
var tableColumns;
var difficulty = 2;

class SnakeBodyCell {
    constructor(row, column) {
      this.row = row;
      this.column = column;
    }
}

class Snake {
    constructor(id) {
        this.id = id;
        this.body = [];
    }
}

//event listeners
document.addEventListener('keydown', changeDirection);
function changeDirection(event) {
    if (event.key === 'ArrowLeft' && currentDirection != RIGHT)
        currentDirection = LEFT;
    else if (event.key === 'ArrowUp' && currentDirection != DOWN)
        currentDirection = UP;
    else if (event.key === 'ArrowRight' && currentDirection != LEFT)
        currentDirection = RIGHT;
    else if (event.key === 'ArrowDown' && currentDirection != UP)
        currentDirection = DOWN;
}

function initializeSnakeGame(rows, columns) {
    //remove the start game button
    var startGameButtom = document.getElementById("startGameButton");
    startGameButtom.remove();

    //initialize the table
    table = document.createElement("table");
    table.classList.add("snake-table");

    //make it so the table can't be too small
    tableRows = Math.max(8, rows);
    tableColumns = Math.max(20, columns);

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

    //initialize the snake
    var randomRow = getRandomIntegerInRange(0, tableRows);
    var randomColumn = getRandomIntegerInRange(0, tableColumns);
    var bodyPart = new SnakeBodyCell(randomRow, randomColumn);
    snakeBody.push(bodyPart);

    unpauseGame();

    PlaySnakeGame();
}

function updateSnakeGame() {
    updateSnakeCellsOnTable("empty-cell");
    checkGame();
    updateSnakeCellsOnTable("snake-cell");

    //update the divs here
    document.getElementById("scoreData").textContent = snakeBody.length;
}

//update this so that it 
function placeObjectRandomlyOnTable(objectClass) {
    var randomRow = getRandomIntegerInRange(0, tableRows);
    var randomColumn = getRandomIntegerInRange(0, tableColumns);
    pieceOfFood = [randomRow, randomColumn];
    changeCellClass(randomRow, randomColumn, objectClass);
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
    //if the food was eaten, make a new piece
    if(pieceOfFood == null){
        placeObjectRandomlyOnTable("food-cell");
    }

    var currHeadRow = snakeBody[0].row;
    var currHeadColumn = snakeBody[0].column;

    var cutTail = true;
    if(currHeadRow == pieceOfFood[0] && currHeadColumn == pieceOfFood[1]){
        pieceOfFood = null;
        showAlert = true;
        cutTail =  false;
    }

    switch (currentDirection) {
        case LEFT:
            currHeadColumn = Math.max(0, currHeadColumn - 1);
            break;
        case UP:
            currHeadRow = Math.max(0, currHeadRow - 1);
            break;
        case RIGHT:
            currHeadColumn = Math.min(tableColumns - 1, currHeadColumn + 1);
            break;
        case DOWN:
            currHeadRow = Math.min(tableRows - 1, currHeadRow + 1);
            break;
    }

    var bodyPart = new SnakeBodyCell(currHeadRow, currHeadColumn);
    snakeBody.unshift(bodyPart);

    if(cutTail)
        snakeBody.pop();
}

function updateSnakeCellsOnTable(cellClass) {
    for(var i = 0; i < snakeBody.length; i++) {
        changeCellClass(snakeBody[i].row, snakeBody[i].column, cellClass);
    }
}

function checkGameWin() {
    if(snakeBody.length == (tableRows * tableColumns)) {
        return true;
    } 
    return false;
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