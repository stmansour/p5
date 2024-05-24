

class FPT {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.realval = 0;
        this.val = 0;
        this.row = 0;
        this.col = 0;
        this.name = "";
    }

    draw() {
        noStroke();
        if (showMappedColor) {
            fill(this.val * 255);
        } else {
            fill(this.realval * 255);
        }
        rect(this.x - rez2, this.y - rez2, rez, rez);
    }
    dotDraw() {
        noStroke();
        fill(127);
        rect(this.x - rez2, this.y - rez2, rez, rez);
        if (showMappedColor) {
            fill(this.val * 255);
        } else {
            fill(this.realval * 255);
        }
        ellipse(this.x, this.y, rez2);
    }

}
