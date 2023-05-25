import { SnakeBodyCell, Snake, snakes, playerSnake } from "./tableObjects.js";
import {Food, food} from "./food.js";

const MAX_HUMAN_PLAYERS = 3;
const MAX_DIFFICULTY = 5;
const MAX_AMOUNT_OF_FOOD = 10;
var startingDifficulty = 3;

var isPaused = false;
var table = null;
var pieceOfFood;
var intervalClock;

const ZERO = 0;

var tableRows;
var tableColumns;

const playerDictionary = {
    playerOne: { id: 1, classStyleName: 'snake-cell', keybinds: { up: 'w', right: 'd', down: 's', left: 'a' } },
    playerTwo: { id: 2, classStyleName: 'snake-cell-two', keybinds: { up: 'ArrowUp', right: 'ArrowRight', down: 'ArrowDown', left: 'ArrowLeft' } },
    playerThree: { id: 3, classStyleName: 'snake-cell', keybinds: { up: 'i', right: 'l', down: 'k', left: 'j' } }
};



document.addEventListener('keydown', updateSnakesDirections);
function updateSnakesDirections(event) {
    if (event.key.startsWith('Arrow')) {
        event.preventDefault(); // Prevent default scrolling behavior
    } 

    for (let [key, player] of Object.entries(playerDictionary)) {
        var snakeToUpdate = findSnakeWithID(player.id);
        if(!isValueInDictionary(event.key, player.keybinds) && snakeToUpdate.directionSetForFrame == false) continue;

        if (event.key === player.keybinds.left && snakeToUpdate.direction != Snake.RIGHT)
            snakeToUpdate.direction = Snake.LEFT;
        else if (event.key === player.keybinds.up && snakeToUpdate.direction != Snake.DOWN)
            snakeToUpdate.direction = Snake.UP;
        else if (event.key === player.keybinds.right && snakeToUpdate.direction != Snake.LEFT)
            snakeToUpdate.direction = Snake.RIGHT;
        else if (event.key === player.keybinds.down && snakeToUpdate.direction != Snake.UP)
            snakeToUpdate.direction = Snake.DOWN;

        snakeToUpdate.directionSetForFrame = true;
    }
}

function initializeSnakeGame(rows, columns) {
    //remove the start game button
    var startGameButtom = document.getElementById("startGameButton");
    startGameButtom.remove();

    initializeTable(rows, columns);
    setupHumanPlayers();
    unpauseGame();
}

function isValueInDictionary(value, dictionary) {
    for (let key in dictionary) {
      if (dictionary[key] === value) {
        return true;
      }
    }
    return false;
}

function findSnakeWithID(id) {
    for(var i = 0; i < snakes.length; i++) {
        if(id == snakes[i].id){
            return snakes[i];
        }
    }
}

function setupHumanPlayers() {
    var amountHumanPlayers = 0;
    for (let [key, player] of Object.entries(playerDictionary)) {
        if(amountHumanPlayers >= MAX_HUMAN_PLAYERS) return;
        
        var humanSnake = new playerSnake(player.id, player.classStyleName, player.keybinds);
        var initialBodyCell = new SnakeBodyCell();
        placeObjectRandomlyOnTable(initialBodyCell);
        humanSnake.body.push(initialBodyCell);
        snakes.push(humanSnake);
        amountHumanPlayers++;
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

function updateFood() {

}

function updateSnakeGame() {
    for(var i = 0; i < snakes.length; i++) {
        snakes[i].directionSetForFrame = false;
        var currHeadRow = snakes[i].body[0].row;
        var currHeadColumn = snakes[i].body[0].column;
        var cutTail = true;

        //if the food was eaten, make a new piece
        if(pieceOfFood == null){
            pieceOfFood = new Food();
            placeObjectRandomlyOnTable(pieceOfFood);
        }

        if(currHeadRow == pieceOfFood.row && currHeadColumn == pieceOfFood.column){
            pieceOfFood = null;
            cutTail =  false;
            increaseGameSpeed(0.1);
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
        if(!classList.contains("empty-cell") && !classList.contains("food-cell")) {
            snakes[i].isAlive = false;
            continue;
        }

        changeSnakeCellBodyClass(snakes[i], 'empty-cell');
        
        var bodyPart = new SnakeBodyCell(currHeadRow, currHeadColumn);
        snakes[i].body.unshift(bodyPart);

        if(cutTail)
            snakes[i].body.pop();

        changeSnakeCellBodyClass(snakes[i]);
    }
    removeDeadSnakes();
}

function removeDeadSnakes() {
    for(var i = 0; i < snakes.length; i++) {
        if(snakes[i].isAlive) continue;
        changeSnakeCellBodyClass(snakes[i], 'empty-cell');
        
        var index = snakes.indexOf(snakes[i]);
        if (index !== -1) {
            snakes.splice(index, 1);
        }
        
    }
}

function changeSnakeCellBodyClass(snake, cellClass = snake.classStyleName) {
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
    intervalClock = setInterval(updateSnakeGame, 250 / startingDifficulty);
    isPaused = false;
}

function pauseGame() {
    clearInterval(intervalClock);
    isPaused = true;
}

function increaseGameSpeed(additionalDifficulty) {
    startingDifficulty = Math.min(startingDifficulty + additionalDifficulty, MAX_DIFFICULTY);
    clearInterval(intervalClock);
    intervalClock = setInterval(updateSnakeGame, 250 / startingDifficulty);
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

//add functionality to buttons
document.getElementById("startGameButton").addEventListener("click", function() {
    initializeSnakeGame(40, 60);
});

document.getElementById("pauseGameButton").addEventListener("click", function() {
    pauseGameToggle();
});