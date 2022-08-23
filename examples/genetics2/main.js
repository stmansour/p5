/*jshint esversion: 6 */

let app = {
    width: 800,
    height: 500,
    population: null,
    lifespan: 200,  // each rocket lives for 200 frames
    idx: 0,         // current index into genes
};

function setup() {
    let c = createCanvas(app.width, app.height);
    c.parent('theCanvas');
    app.population = new Population();
}

function draw() {
    background(0);
    app.population.run();
    updateUI();
    app.idx++;
    if (app.idx >= app.lifespan) {
        app.idx = 0;
        app.population.reset();
    }
}
