/*jshint esversion: 6 */
var app = {
    width: 800,
    height: 400,
    theta: 0,
    buf: [],
    c: [],
    animationFrameRateSlider: null,
    animationFrameRate: 24,
    orderN: 4,
    orderNSlider: null,
    showCirclesCheckbox: null,
    showCircles: true,
    graph: null,
};

function setup() {
    var canvas = createCanvas(app.width,app.height);
    canvas.parent('theCanvas');
    app.c.push(color(255,255,50));  // 0 yellow
    app.c.push(color(50,255,50));   // 1 green
    app.c.push(color(255,50,50));   // 2 red
    app.c.push(color(150,150,255)); // 3 blue
    app.c.push(color(255,50,255));  // 4 magenta
    app.c.push(color(50,255,255));  // 5 cyan
    app.c.push(color(255,164,0));   // 6 orange
    initUI();
    setInnerHTML("animationFrameRate", "" + app.animationFrameRate);
    setInnerHTML("orderN", "" + app.orderN);
    frameRate(app.animationFrameRate);
    app.graph = new Graph( 0, -height/4-75, width*4/10, height/4+75);
    app.graph.labels("time","amplitude");
}

function draw() {
    updateUI();
    background(0);
    strokeWeight(1);
    let w = width/10;  // divide screen into parts
    let h = height/app.orderN;
    let x = 0;
    let y = 0;

    // //--------------------------------------------
    // // we can add up to 7 equations. Make a slot
    // // for each...
    // //--------------------------------------------
    // for (let i = 0; i < app.orderN; i++) {
    //     stroke(app.c[i]);
    //     // noFill();
    //     fill(app.c[i]);
    //     rect(x,y,2*w,h-1);
    //     y += h;
    // }

    //---------------------------------------------------------------------
    // TRANSLATE 1:
    // Set origin to the main circle draw area. This area gets 60% of horz space
    //---------------------------------------------------------------------
    push(); // save origin
    translate(3*w,height/2);  // circle stack in the middle
    for (let j = 0; j < app.orderN; j++) {
        let n = 2*j + 1;    // only odd numbers
        let px = x;         // x from last iteration
        let py = y;         // y from last iteration
        let r = 90 * 4 /(n * PI);
        x += r * cos(n * app.theta);    // update x for this n
        y += r * sin(n * app.theta);    // update y for this n

        if (app.showCircles) {
            stroke(app.c[j]);
            noFill();
            circle(px,py,2 * r);
        }
        fill(128);
        stroke(128);
        circle(x,y,5);          // indicator on the circumference of the circle
        stroke(128);
        line(px,py,x,y);        // line from n-1 xy to n xy.  Shows the increment
    }
    line(x, y, 3*w, y);   // line from the circles to the x axis origin of the graph
    pop();

    app.buf.unshift(y);     // adds to beginning rather than end. Makes it work like an oscilloscope

    //---------------------------------------------------
    // TRANSLATE 2:
    // Move the origin to the right for the wave graph
    //---------------------------------------------------
    push();
    translate(6*w,height/2);         // graph on the right (60% width)
    app.graph.axes();
    beginShape();
    strokeWeight(2);
    stroke(app.c[1]);
    noFill();
    for (let i = 0; i < app.buf.length; i++) {
        vertex(i,app.buf[i]);
    }
    endShape();
    pop();

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

    app.orderNSlider = createSlider(1,7,app.orderN,1);
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
