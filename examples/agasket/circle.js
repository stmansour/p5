class Circle {
    constructor (bend, x, y) {
        this.bend = bend;
        this.center = new Complex(x, y);
        this.radius = Math.abs(1/this.bend);
    }

    show() {
        stroke(0);
        strokeWeight(1);
        if (colorCheckbox.checked()) {
            fill( random(255), random(255), random(255) );
        } else {
            noFill();}
        circle(this.center.a, this.center.b, this.radius * 2);
    }

    dist(other) {
        return Math.hypot(this.center.a - other.center.a, this.center.b - other.center.b);
      }
}