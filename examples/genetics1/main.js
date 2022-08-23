/*jshint esversion: 6 */
var app = {
    width: 800,
    height: 400,
    phrase: "Approaching like a drowning wall of love",
    // phrase: "I'm the twenty dollar man",
    randompop: null,
    population: null,
    populationSize: 500,
    mutationRate: 0.009,
    bestDNA: "",
    bestFitness: 0,
    gen0BestDNA: "",
    displayPopCount: 5,
};

function setup() {
    app.population = new Population(app.populationSize);
    app.gen0BestDNA = app.population.best.genes;
    app.randompop = new RandomPopulation(app.populationSize);
}

function draw() {
    showPopulations(app.displayPopCount);  // show what we got

    // compute fitness
    app.population.determineFitness();
    app.bestDNA = app.population.best.genes;
    app.bestFitness = app.population.best.fitness;

    app.randompop.createNextGeneration();
    app.randompop.determineFitness();

    updateUI();
    if (app.bestFitness > 0.999999 || app.randompop.best.fitness > 0.999999) {
        app.population.sortBest();
        showPopulations(app.displayPopCount);
        noLoop();
        return;
    }

    // create next generation:
    //     pick two parents at random, have them produce and offspring
    app.population.createMatingPool();
    app.population.createNextGeneration();
}


function showPopulations(n) {
    let s = "";
    for (let i = 0; i < n; i++) {
        s += HtmlEncode(app.population.p[i].genes) + "<br>";
    }
    setInnerHTML("populationData",s);

    s = "";
    for (let i = 0; i < n; i++) {
        s += HtmlEncode(app.randompop.p[i].genes) + "<br>";
    }
    setInnerHTML("randomPopData",s);
}
