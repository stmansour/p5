let app = {
    width: 1000,
    height: 650,
    minBranchLen: 5,
    initialBranchLen: 150,
    branchDecay: .7,
    branchRotation: 45,
    sliderBranchRotation: null,
    sliderBranchLen: null,
    sliderBranchDecay: null,
};

function setup() {
    var canvas = createCanvas(app.width,app.height);
    canvas.parent('theCanvas');
    angleMode(DEGREES);
    initUI();
}

function draw() {
    background(50);
    stroke("white");
    updateUI();
    translate(app.width/2,app.height);
    branch(app.initialBranchLen);
}

function branch(l) {
    line(0,0,0,-l);
    translate(0,-l);
    if (l > app.minBranchLen) {
        push(); // save transformation state
        rotate(app.branchRotation);
        branch(l * app.branchDecay)
        pop(); // return to what it was
        push();
        rotate(-app.branchRotation);
        branch(l * app.branchDecay);
        pop();
    }
}

function initUI() {
    app.sliderBranchRotation = createSlider(0,360,app.branchRotation,1);
    app.sliderBranchLen = createSlider(0,300,app.initialBranchLen,1);
    app.sliderBranchDecay = createSlider(0,.8,app.branchDecay,.01);
    app.sliderBranchRotation.parent('branchRotationSlider');
    app.sliderBranchLen.parent('initialBranchLenSlider');
    app.sliderBranchDecay.parent('branchDecaySlider');
}

function updateUI() {
    app.branchRotation = app.sliderBranchRotation.value();
    app.initialBranchLen = app.sliderBranchLen.value();
    app.branchDecay = app.sliderBranchDecay.value();
    setInnerHTML("branchRotation", "" + app.branchRotation);
    setInnerHTML("initialBranchLen", "" + app.initialBranchLen);
    setInnerHTML("branchDecay", "" + app.branchDecay);
}

function setInnerHTML(id,s) {
    let el = document.getElementById(id);
    if (el != null) {
        el.innerHTML = s;
    }
}
