class Maze {
    constructor(nbRow, nbCol, speed) {
        this.canvas         = document.getElementById('canvas');
        this.ctx            = this.canvas.getContext('2d');
        this.generateButton = document.getElementById('generate');
        this.loader         = document.querySelector('.loader');
        this.paraTimeTaken  = document.querySelector('.time-taken');

        this.nbRow                  = nbRow;
        this.nbCol                  = nbCol;
        this.cellSize               = 30;
        this.visitedCell            = [];
        this.cursorPositionHistoric = null;
        this.cursor                 = 0;
        this.to                     = null;

        this.starting  = new Date();
        this.ending    = null;
        this.timeTaken = null;


        if (!speed) {
            this.speed = 100;
        } else {
            this.speed = speed;
        }

        this.currentPos = {
            x: 0,
            y: 0
        }

        this.directionAvailable = {
            top: false,
            bottom: false,
            right: false,
            left: false
        }

        this.directionToGo = null;

        this.positionHistoric = {
            x: [],
            y: []
        }

        this.init();
        this.explore();
    }

    init = () => {
        this.initCanvasSize();
        this.initMaze();
        this.initMazeMatrix();
        this.initParaTimeTaken();
        this.disableGenerateButton();
    }

    initCanvasSize = () => {
        this.canvas.width  = this.nbCol * this.cellSize;
        this.canvas.height = this.nbRow * this.cellSize;
    }

    initMaze = () => {
        for (let i = 0; i <= this.nbCol; i++) {
            this.ctx.moveTo(i * this.cellSize, 0);
            this.ctx.lineTo(i * this.cellSize, this.canvas.height);
            this.ctx.stroke();
        }

        for (let j = 0; j <= this.nbRow; j++) {
            this.ctx.moveTo(0, j * this.cellSize);
            this.ctx.lineTo(this.canvas.width, j * this.cellSize);
            this.ctx.stroke();
        }
    }

    initParaTimeTaken = () => {
        this.paraTimeTaken.textContent = '';
    }

    initDepartureAndArrival = () => {
        this.ctx.font = "20px Arial";
        this.ctx.fillText("D", 8, 22);

        this.ctx.font = "20px Arial";
        this.ctx.fillText("A", this.canvas.width - 22, this.canvas.height - 8);
    }

    /**
     * Set the complete maze to false but the first case
     * false means that the cell has not been explored
     */
    initMazeMatrix = () => {
        for (let i = 0; i < this.nbRow; i++) {
            this.visitedCell[i] = [];
            for (let j = 0; j < this.nbCol; j++) {
                this.visitedCell[i][j] = false;
            }
        }
        this.visitedCell[0][0] = true;
    }

    drawCursor = () => {
        this.ctx.fillStyle = 'grey';
        this.ctx.rect((this.currentPos.y * this.cellSize) + 2, (this.currentPos.x * this.cellSize) + 2, 26, 26);
        this.ctx.fill();
        if (this.cursor > 0) {
            for (let i = 0; i < this.positionHistoric.x.length - 1; i++) {
                this.ctx.clearRect((this.positionHistoric.y[i] * this.cellSize) + 2, (this.positionHistoric.x[i] * this.cellSize) + 2, 26, 26);
            }
        }
        if (this.cursor === 0) {
            this.cursor++;
        }
    }

    /**
     * Check if according the the current position, there is a direction available
     */
    getDirectionAvailable = () => {

        if (this.currentPos.x === 0 && this.currentPos.y === 0) {
            if (this.visitedCell[this.currentPos.x + 1][this.currentPos.y] === false) {
                this.directionAvailable.bottom = true;
            }

            if (this.visitedCell[this.currentPos.x][this.currentPos.y + 1] === false) {
                this.directionAvailable.right = true;
            }
        }

        if (this.currentPos.x === this.nbRow - 1 && this.currentPos.y === this.nbCol - 1) {
            if (this.visitedCell[this.currentPos.x - 1][this.currentPos.y] === false) {
                this.directionAvailable.top = true;
            }

            if (this.visitedCell[this.currentPos.x][this.currentPos.y - 1] === false) {
                this.directionAvailable.left = true;
            }
        }

        if (this.currentPos.x > 0 && this.currentPos.x < this.nbRow - 1 && this.currentPos.y === 0) {
            if (this.visitedCell[this.currentPos.x + 1][this.currentPos.y] === false) {
                this.directionAvailable.bottom = true;
            }

            if (this.visitedCell[this.currentPos.x][this.currentPos.y + 1] === false) {
                this.directionAvailable.right = true;
            }

            if (this.visitedCell[this.currentPos.x - 1][this.currentPos.y] === false) {
                this.directionAvailable.top = true;
            }
        }

        if (this.currentPos.x === 0 && this.currentPos.y > 0 && this.currentPos.y < this.nbCol - 1) {
            if (this.visitedCell[this.currentPos.x + 1][this.currentPos.y] === false) {
                this.directionAvailable.bottom = true;
            }

            if (this.visitedCell[this.currentPos.x][this.currentPos.y + 1] === false) {
                this.directionAvailable.right = true;
            }

            if (this.visitedCell[this.currentPos.x][this.currentPos.y - 1] === false) {
                this.directionAvailable.left = true;
            }
        }

        if (this.currentPos.x === this.nbRow - 1 && this.currentPos.y === 0) {
            if (this.visitedCell[this.currentPos.x][this.currentPos.y + 1] === false) {
                this.directionAvailable.right = true;
            }

            if (this.visitedCell[this.currentPos.x - 1][this.currentPos.y] === false) {
                this.directionAvailable.top = true;
            }

        }

        if (this.currentPos.x === 0 && this.currentPos.y === this.nbCol - 1) {
            if (this.visitedCell[this.currentPos.x + 1][this.currentPos.y] === false) {
                this.directionAvailable.bottom = true;
            }

            if (this.visitedCell[this.currentPos.x][this.currentPos.y - 1] === false) {
                this.directionAvailable.left = true;
            }
        }

        if (this.currentPos.x === this.nbRow - 1 && this.currentPos.y > 0 && this.currentPos.y < this.nbCol - 1) {
            if (this.visitedCell[this.currentPos.x - 1][this.currentPos.y] === false) {
                this.directionAvailable.top = true;
            }

            if (this.visitedCell[this.currentPos.x][this.currentPos.y + 1] === false) {
                this.directionAvailable.right = true;
            }

            if (this.visitedCell[this.currentPos.x][this.currentPos.y - 1] === false) {
                this.directionAvailable.left = true;
            }
        }

        if (this.currentPos.x > 0 && this.currentPos.x < this.nbRow - 1 && this.currentPos.y === this.nbCol - 1) {
            if (this.visitedCell[this.currentPos.x - 1][this.currentPos.y] === false) {
                this.directionAvailable.top = true;
            }

            if (this.visitedCell[this.currentPos.x + 1][this.currentPos.y] === false) {
                this.directionAvailable.bottom = true;
            }

            if (this.visitedCell[this.currentPos.x][this.currentPos.y - 1] === false) {
                this.directionAvailable.left = true;
            }
        }

        if (this.currentPos.x > 0 && this.currentPos.x < this.nbRow - 1 && this.currentPos.y > 0 && this.currentPos.y < this.nbCol - 1) {
            if (this.visitedCell[this.currentPos.x - 1][this.currentPos.y] === false) {
                this.directionAvailable.top = true;
            }

            if (this.visitedCell[this.currentPos.x + 1][this.currentPos.y] === false) {
                this.directionAvailable.bottom = true;
            }

            if (this.visitedCell[this.currentPos.x][this.currentPos.y + 1] === false) {
                this.directionAvailable.right = true;
            }

            if (this.visitedCell[this.currentPos.x][this.currentPos.y - 1] === false) {
                this.directionAvailable.left = true;
            }
        }
    }

    explore = () => {
        this.positionHistoric.x.push(this.currentPos.x);
        this.positionHistoric.y.push(this.currentPos.y);
        this.cursorPositionHistoric = this.positionHistoric.x.length - 1;

        this.drawCursor();
        this.initDepartureAndArrival();
        this.resetDirectionAvailable();
        this.getDirectionAvailable();
        this.setDirectionToGo();
        this.move();
    }

    /**
     * While the maze is not fully explored
     * this will return false
     * @returns {boolean}
     */
    isMazeFullyExplored = () => {
        let k = 0;
        for (let i = 0; i < this.nbRow; i++) {
            for (let j = 0; j < this.nbCol; j++) {
                if (this.visitedCell[i][j] === false) {
                    k++;
                }
            }
        }

        return k === 0;
    }

    setDirectionToGo = () => {
        let directionAvailableObjectValues = [];
        let nbDirectionAvailable           = 0;
        let rand                           = 0;
        let available                      = [];
        let atLeastOneDirectionIsAvailable = false;

        directionAvailableObjectValues = Object.values(this.directionAvailable);

        // count the number of directions set to true (i)
        for (let j = 0; j < directionAvailableObjectValues.length; j++) {
            if (directionAvailableObjectValues[j] === true) {
                nbDirectionAvailable++;
            }
        }

        // if there is no direction available (bottom / top / left / right are set to false)
        if (nbDirectionAvailable === 0) {
            clearTimeout(this.to);
            if (!this.isMazeFullyExplored()) {
                this.cursorPositionHistoric -= 1;

                // get the position of the previous position
                this.currentPos.x = this.positionHistoric.x[this.cursorPositionHistoric];
                this.currentPos.y = this.positionHistoric.y[this.cursorPositionHistoric];

                // get the the directions available for the previous position
                this.getDirectionAvailable();

                // if there is no direction available
                if (this.directionAvailable.bottom === false && this.directionAvailable.top === false && this.directionAvailable.left === false && this.directionAvailable.right === false) {
                    setTimeout(() => {
                        // redo the whole method and this will get the previous position of the previous position etc
                        this.setDirectionToGo();
                    }, 5);
                } else {
                    atLeastOneDirectionIsAvailable = true;
                }
            } else {
                clearTimeout(this.to);
                this.ending    = new Date();
                this.timeTaken = this.ending - this.starting;
                this.enableGenerateButton();
                this.initDepartureAndArrival();
                this.showTimeTaken();
                this.removeLastCursor();
            }
        }

        // rand between 1 and the number of the directions available
        rand = Math.floor(Math.random() * nbDirectionAvailable) + 1;
        // to get a number between 0 and i - 1
        rand -= 1;

        // push the key of the directions available in an array
        for (let directionAvailable in this.directionAvailable) {
            if (this.directionAvailable[directionAvailable] === true) {
                available.push(directionAvailable);
            }
        }

        // get a random direction to go
        this.directionToGo = available[rand];

        if (atLeastOneDirectionIsAvailable) {
            this.move();
        }
    }

    move = () => {
        const DIRECTION_MATRIX = {
            top: {
                x: -1,
                y: 0
            },
            bottom: {
                x: 1,
                y: 0
            },
            left: {
                x: 0,
                y: -1
            },
            right: {
                x: 0,
                y: 1
            }
        }

        if (DIRECTION_MATRIX[this.directionToGo]) {
            // update of the current position
            this.currentPos.x += DIRECTION_MATRIX[this.directionToGo].x;
            this.currentPos.y += DIRECTION_MATRIX[this.directionToGo].y;


            // update of the cells that have been visited
            this.visitedCell[this.currentPos.x][this.currentPos.y] = true;

            this.clearEdge();
        }
    }

    clearEdge = () => {
        let x = this.currentPos.y * this.cellSize;
        let y = this.currentPos.x * this.cellSize;

        switch (this.directionToGo) {
            case 'top':
                this.ctx.clearRect(x + 1, y - 1 + this.cellSize, 28, 2);
                break;
            case 'bottom':
                this.ctx.clearRect(x + 1, y - 1, 28, 2);
                break;
            case 'left':
                this.ctx.clearRect(x - 1 + this.cellSize, y + 1, 2, 28);
                break;
            case 'right':
                this.ctx.clearRect(x - 1, y + 1, 2, 28);
                break;
            default:
                break;
        }

        this.to = setTimeout(() => {
            this.explore();
        }, this.speed);
    }


    resetDirectionAvailable = () => {
        this.directionAvailable = {
            top: false,
            bottom: false,
            right: false,
            left: false
        }
    }

    disableGenerateButton = () => {
        this.generateButton.setAttribute("disabled", "");
        this.generateButton.classList.add("working");
        this.generateButton.textContent = "Génération en cours ...";
        this.loader.classList.add('active');
    }

    enableGenerateButton = () => {
        this.generateButton.removeAttribute("disabled");
        this.generateButton.classList.remove("working");
        this.generateButton.textContent = "Générer";
        this.loader.classList.remove('active');
    }

    showTimeTaken = () => {
        this.paraTimeTaken.textContent = `Le labyrinthe a été généré en ${this.timeTaken / 1000} secondes`;
    }

    removeLastCursor = () => {
        this.ctx.clearRect((this.positionHistoric.y[this.positionHistoric.y.length - 1] * this.cellSize) + 2, (this.positionHistoric.x[this.positionHistoric.x.length - 1] * this.cellSize) + 2, 26, 26);
    }
}

