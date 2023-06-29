/*jshint esversion: 6 */
var app = {
    width: 800,
    height: 400,
    phrase: "Approaching like a drowning wall of love",
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
    app.population  = new Population(app.populationSize);       // initial population for the genetic algorithm
    app.gen0BestDNA = app.population.best.genes;                // best phrase from the totally random generation 0
    app.randompop   = new RandomPopulation(app.populationSize); // initial population for the randome algorithm
}

function draw() {
    showPopulations(app.displayPopCount);                   // show some of the population -- we won't show all 500 members
    updateUI();                                             // this just shows Best Result so far, etc., summary information

    // stop the simulation if we reached the goal
    if (app.bestFitness > 0.999999 || app.randompop.best.fitness > 0.999999) {
        app.population.sortBest();
        showPopulations(app.displayPopCount);
        noLoop();
    } else {
        //---------------------------------
        //  Next RANDOM generation...
        //---------------------------------
        app.randompop.createNextGeneration();               // another random population
        app.randompop.determineFitness();                   // check it for fitness

        //---------------------------------
        //  Next GENETIC generation...
        //---------------------------------
        app.population.createMatingPool();                  // closer the phrase is to the target phrase, the better its chances of being selected for mating
        app.population.createNextGeneration();              // includes DNA crossover and mutation
        app.population.determineFitness();                  // how well each new member of the population compares to the target phrase
        app.bestDNA = app.population.best.genes;            // some status info for next frame
        app.bestFitness = app.population.best.fitness;      // some status info for next frame
    }
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
