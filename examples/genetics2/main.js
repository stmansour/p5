/*jshint esversion: 6 */

let app = {
    width: 800,
    height: 500,
    population: null,
    lifespan: 200,  // each rocket lives for 200 frames
    cycle: 0,       // current index into genes, frame of the generation, from 0 to lifespan-1
    targetx: 0,
    targety: 0,
    targetDiameter: 25,
    results: null,
    UID: 0,         // available to all, just increment after use
};

function setup() {
    let c = createCanvas(app.width, app.height);
    c.parent('theCanvas');
    app.population = new Population();
    app.targetx = width/2;
    app.targety = 25;
}

function draw() {
    background(0);
    app.population.run();
    updateUI();
    app.cycle++;
    if (app.cycle >= app.lifespan) {
        app.cycle = 0;
        app.results = app.population.collectResults();
        app.population.nextGeneration();
    }
    circle(app.targetx, app.targety, app.targetDiameter);
}
