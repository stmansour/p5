class Circle {
    constructor (bend, x, y) {
        this.bend = bend;
        this.center = new Complex(x, y);
        this.radius = Math.abs(1/this.bend);
    }

    show() {
        stroke(255);
        strokeWeight(1);
        noFill();
        circle(this.center.a, this.center.b, this.radius * 2);
    }
}