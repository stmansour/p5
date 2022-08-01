let app = {
    width: 1000,
    height: 650,
    minBranchLen: 5,
    initialBranchLen: 150,
    branchDecay: .7,
    branchRotation: 45,
    tree: null,
    jitter: false,
    jitterCB: null,
    wobble: false,
    wobbleCB: null,
};

function setInnerHTML(id,s) {
    let el = document.getElementById(id);
    if (el != null) {
        el.innerHTML = s;
    }
}

function setup() {
    var canvas = createCanvas(app.width,app.height);
    canvas.parent('theCanvas');
    angleMode(DEGREES);
    initUI();
    app.tree = new Tree();
    app.tree.grow();
}

function draw() {
    background(50);
    stroke("white");
    updateUI();
    app.tree.show();
    app.tree.grow();
}

function updateUI() {
    setInnerHTML("branchRotation", "" + app.branchRotation);
    setInnerHTML("initialBranchLen", "" + app.initialBranchLen);
    setInnerHTML("branchDecay", "" + app.branchDecay);
    setInnerHTML('wobble', app.wobble ? 'ON' : 'OFF');
    setInnerHTML('jitter', app.jitter ? 'ON' : 'OFF');
}

function initUI() {
    app.wobbleCB = createCheckbox('wobble', app.wobble);
    app.wobbleCB.changed(wobbleChanged);
    app.wobbleCB.parent("wobbleBtn");
    app.jitterCB = createCheckbox('jitter', app.jitter);
    app.jitterCB.changed(jitterChanged);
    app.jitterCB.parent("jitterBtn");
}

function wobbleChanged() {
    app.wobble = app.wobbleCB.checked();
    updateUI();
}

function jitterChanged() {
    app.jitter = app.jitterCB.checked();
    updateUI();
}
