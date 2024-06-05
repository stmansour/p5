class Complex {
    constructor(a, b) {
        this.a = a;
        this.b = b;
    }

    add(other) {
        return new Complex(this.a + other.a, this.b + other.b);
    }

    sub(other) {
        return new Complex(this.a - other.a, this.b - other.b);
    }

    scale(n) {
        return new Complex(this.a * n, this.b * n);
    }

    multiply(other) {
        return new Complex(this.a * other.a - this.b * other.b, this.a * other.b + this.b * other.a);
    }

    sqrt() {
        // first convert to polar coordinates
        let m = this.a * this.a + this.b * this.b;
        let r = Math.sqrt(m);
        let theta = Math.atan2(this.b, this.a);

        // now compute sqrt of magnitude and 1/2 the angle
        r = Math.sqrt(r)
        theta /= 2;

        // convert back to cartesian
        return new Complex(r * Math.cos(theta), r * Math.sin(theta));
    }
}