/*jshint esversion: 6 */
var app = {
    width: 800,
    height: 500,
    theta: 0,
    buf: [],
    c: [],
    animationFrameRateSlider: null,
    animationFrameRate: 24,
    orderN: 4,
    orderNSlider: null,
    showCirclesCheckbox: null,
    showCircles: true,
};

function setup() {
    var canvas = createCanvas(app.width,app.height);
    canvas.parent('theCanvas');
    app.c.push(color(255,255,50)); // yellow
    app.c.push(color(50,255,50));   // green
    app.c.push(color(255,50,50));   // red
    app.c.push(color(150,150,255));   // blue
    app.c.push(color(255,50,255));  // magenta
    app.c.push(color(50,255,255));  // cyan
    initUI();
    setInnerHTML("animationFrameRate", "" + app.animationFrameRate);
    setInnerHTML("orderN", "" + app.orderN);
    frameRate(app.animationFrameRate);

}

function draw() {
    updateUI();
    background(0);
    let w = width/3;
    translate(w,height/2);

    let x = 0;
    let y = 0;

    for (let j = 0; j < app.orderN; j++) {
        let n = 2*j + 1;
        let px = x;
        let py = y;

        // fourier:  radius *  4sin(n*theta)/(n*PI)
        let r = 100 * 4 /(n * PI);
        x += r * cos(n * app.theta);
        y += r * sin(n * app.theta);

        // stroke(255);
        if (app.showCircles) {
            stroke(app.c[j]);
            noFill();
            circle(px,py,2 * r);
        }
        fill(255);
        circle(x,y,4);
        stroke(255);
        line(px,py,x,y);
    }

    app.buf.unshift(y); // adds to beginning rather than end.

    translate(w,0);
    line(x - w, y, 0, y);
    beginShape();
    noFill();
    for (var i = 0; i < app.buf.length; i++) {
        vertex(i,app.buf[i]);
    }
    endShape();

    if (app.buf.len > 150) {
        app.buf.len.pop();  // keep buf from growing too big
    }
    app.theta += 0.02;
}

function setInnerHTML(id,s) {
    let el = document.getElementById(id);
    if (el != null) {
        el.innerHTML = s;
    }
}

function initUI() {
    app.animationFrameRateSlider = createSlider(2,60,app.animationFrameRate,1);
    app.animationFrameRateSlider.parent('animationFrameRateSlider');

    app.orderNSlider = createSlider(0,6,app.orderN,1);
    app.orderNSlider.parent('orderNSlider');

    app.showCirclesCheckbox = createCheckbox("Show Circles", app.showCircles);
    app.showCirclesCheckbox.parent('showCirclesCheckbox');
}

function updateUI() {
    let f = app.animationFrameRateSlider.value();
    if ( abs(f - app.animationFrameRate) > 3 ) {
        app.animationFrameRate = app.animationFrameRateSlider.value();
        setInnerHTML("animationFrameRate", "" + app.animationFrameRate);
        frameRate(app.animationFrameRate);
    }

    app.orderN = app.orderNSlider.value();
    setInnerHTML("orderN", "" + app.orderN);

    app.showCircles = app.showCirclesCheckbox.checked();
    // setInnerHTML("showCircles", "" + app.showCircles);
}

function circleChecboxChanged() {

}
