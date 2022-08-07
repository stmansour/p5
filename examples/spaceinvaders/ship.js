function Ship() {
    this.width = 40;
    this.height = 15;
    this.gunwidth = 4;
    this.gunheight = 10;
    this.x = width/2;
    this.y = height - this.height;
    this.movingLeft = false;
    this.movingRight = false;
    this.moveAmt = 8;

    this.show = function() {
        fill('#00ff00');
        noStroke();
        rect(this.x - this.width/2,this.y, this.width, this.height);
        rect(this.x - this.gunwidth/2, this.y - this.gunheight, this.gunwidth,this.gunheight);
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
