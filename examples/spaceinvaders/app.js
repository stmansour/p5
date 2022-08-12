class App {
    constructor() {
        this.a1 = null; // invader a image arms down
        this.a2 = null; // invader a image arms up
        this.b1 = null; // invader a image arms down
        this.b2 = null; // invader a image arms up
        this.c1 = null; // invader a image arms down
        this.c2 = null; // invader a image arms up
        this.cannon = null; // the laser cannon image
        this.invaders = null;
        this.laserCannon = null;
        this.shots = null;
        this.maxShipWidth = 0;
        this.border = 30;
        this.topBar = 50; // y limit of top area for messages/scores, etc.
        this.gameOver = false;
        this.gameOverTimer = null;
        this.gameStatus = 0; // 0 = in progress, 1 = player won, 2 = player lost
        this.players = []; // array of player objects.
        this.currentPlayer = 0; // during play, this can be 0 or 1
        this.highScore = 0;
        this.credits = 0;
        this.cSize = 18; // size of large characters
        this.font = null;
        this.mode = 0; // 0 = not playing, 1 = 1 player, 2 = 2 players, 3 = freeze screen so user can see why they lost
    }

    loadImages() {
        this.a1 = loadImage('assets/a1.png');
        this.a2 = loadImage('assets/a2.png');
        this.b1 = loadImage('assets/b1.png');
        this.b2 = loadImage('assets/b2.png');
        this.c1 = loadImage('assets/c1.png');
        this.c2 = loadImage('assets/c2.png');
        this.cannon = loadImage('assets/lasercannon.png');

        this.font = loadFont("assets/PixelSplitter-Bold.ttf");
    }

    loadAllPixels() {
        this.a1.loadPixels();
        this.a2.loadPixels();
        this.b1.loadPixels();
        this.b2.loadPixels();
        this.c1.loadPixels();
        this.c2.loadPixels();
    }

    setMaxShipWidth() {
        this.maxShipWidth = this.a1.width;
        if (this.b1.width > this.maxShipWidth) {
            this.maxShipWidth = this.b1.width;
        }
        if (this.c1.width > this.maxShipWidth) {
            this.maxShipWidth = this.c1.width
        }
    }

    setGameOver(status) {
        this.gameOver = true;
        this.gameStatus = status;
        if (this.players[this.currentPlayer].score > this.highScore) {
            this.highScore = this.players[this.currentPlayer].score;
            hiScore();
        }
    }
}
