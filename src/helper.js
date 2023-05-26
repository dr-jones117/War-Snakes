import { table, EMPTY_CELL_CLASS_NAME } from "./main";

//helper functions
export function isValueInDictionary(value, dictionary) {
    for (let key in dictionary) {
      if (dictionary[key] === value) return true;
    }
    return false;
}

export function getRandomIntegerInRange(min, max) {
    var randomNumber = Math.random();
    var randomNumberScaled = randomNumber * max + min;
    return Math.floor(randomNumberScaled);
}

export function getCellClassList(row, column) {
    var rows = table.getElementsByTagName("tr");
    if (row < rows.length) {
        var cells = rows[row].getElementsByTagName("td");
        if (column < cells.length) {
            return cells[column].classList;
        }
    }
}

export function changeCellBrightness(row, column, value) {
    var rows = table.getElementsByTagName("tr");
  
    if (row < rows.length) {
        var cells = rows[row].getElementsByTagName("td");
  
        if (column < cells.length) {
            var cell = cells[column];
            var currentFilter = cell.style.filter || "brightness(100%)";
            var brightnessValue = parseInt(currentFilter.match(/\d+/)); // Extract the current brightness value
            var newBrightness = Math.max(value, 0); // Decrease brightness by 10 (adjust the value as needed)
            cell.style.filter = "brightness(" + newBrightness + "%)";
        }
    }
}

export function isEmptyCell(row, column) {
    var rows = table.getElementsByTagName("tr");
    if (row < rows.length) {
        var cells = rows[row].getElementsByTagName("td");
        if (column < cells.length) {
          return cells[column].classList.contains(EMPTY_CELL_CLASS_NAME);
        }
    }
    return false;
}