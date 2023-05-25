class SnakeBodyCell {
    constructor(row, column) {
      this.row = row;
      this.column = column;
    }
}

class Snake {
    static UP = 'up';
    static RIGHT = 'right';
    static DOWN = 'down';
    static LEFT = 'left';

    constructor(id, classStyleName) {
        this.id = id;
        this.body = [];
        this.classStyleName = classStyleName;
        this.direction = Snake.RIGHT;
        this.isAlive = true;
        this.directionSetForFrame;
    }
}

class Food {
    constructor() {
        this.classStyleName = "food-cell";
        this.row;
        this.column;
    }
}

export {SnakeBodyCell, Snake, Food}