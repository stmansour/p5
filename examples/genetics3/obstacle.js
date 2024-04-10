/* jshint esversion: 6 */

class Obstacle {
    constructor() {
        this.y = random(app.targety + 20, height - 150 );
        this.width = 100 + random(width/4);
        this.x = (width - this.width) / 2;
        this.height = 20;
        this.rectMode = CORNER;
    }

    overlap(o) {
        let x1 = this.x;
        let y1 = this.y;
        let x2 = x1 + this.width;
        let y2 = y1 + this.height;

        let sx = o.pos.x;
        let sy = o.pos.y;
        return  (sx < x2) && (sx >= x1) && (sy < y2) && (sy >= y1);

    }

    show() {
        fill( color(255,80,80) );
        rect(this.x,this.y,this.width,this.height);
    }
}
