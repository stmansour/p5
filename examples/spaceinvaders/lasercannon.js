function LaserCannon() {
    this.width = 0;
    this.height = 0;
    this.x = 0;
    this.y = 0;
    this.movingLeft = false;
    this.movingRight = false;
    this.moveAmt = 8;

    this.init = function() {
        app.cannon.loadPixels()
        this.width = app.cannon.width;
        this.height = app.cannon.height;
        this.y = height - this.height - 60;
        this.x = (width - this.width)/2;
    }

    this.show = function() {
        image(app.cannon, this.x - this.width/2, this.y);
    }

    this.go = function() {
        var amt = this.moveAmt;
        if (this.movingLeft) {
            if (this.x - this.moveAmt < 0) {
                amt = 0;
            }
            this.x -= amt;
        }
        if (this.movingRight) {
            if (this.x + this.moveAmt > width) {
                amt = 0;
            }
            this.x += amt;
        }
    }

    this.goLeft = function(t) {
        this.movingLeft = t;
    }
    this.goRight = function(t) {
        this.movingRight = t;
    }
}
