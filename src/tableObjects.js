export var snakes = []

export class SnakeBodyCell {
    constructor(row, column) {
      this.row = row;
      this.column = column;
    }
}

export class Snake {
    static UP = 'up';
    static RIGHT = 'right';
    static DOWN = 'down';
    static LEFT = 'left';
  
    constructor(id, classStyleName, direction = Snake.RIGHT) {
      this.id = id;
      this.body = [];
      this.classStyleName = classStyleName;
      this.direction = direction;
      this.directionSetForFrame = null;
      this.isAlive = true;
      this.addedAmount = 0;
    }
  }

export class playerSnake extends Snake {
    constructor(id, classStyleName, keybinds) {
        super(id, classStyleName);
        this.keybinds = {
            up: 'ArrowUp',
            right: 'ArrowRight',
            down: 'ArrowDown',
            left: 'ArrowLeft',
        };
    }
}


