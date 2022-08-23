/*jshint esversion: 6 */

function HtmlEncode(s) {
  var el = document.createElement("div");
  el.innerText = el.textContent = s;
  s = el.innerHTML;
  return s;
}

function setInnerHTML(id,s) {
    let el = document.getElementById(id);
    if (el != null) {
        el.innerHTML = s;
    }
}

function initUI() {
    // app.animationFrameRateSlider = createSlider(2,60,app.animationFrameRate,1);
    // app.animationFrameRateSlider.parent('animationFrameRateSlider');
    //
    // app.orderNSlider = createSlider(1,7,app.orderN,1);
    // app.orderNSlider.parent('orderNSlider');
    //
    // app.showCirclesCheckbox = createCheckbox("Show Circles", app.showCircles);
    // app.showCirclesCheckbox.parent('showCirclesCheckbox');
}

function updateUI() {
    setInnerHTML("targetPhrase", app.phrase);
    setInnerHTML("initialPopulation", app.populationSize);
    setInnerHTML("generations", app.population.generations);
    setInnerHTML("bestDNA", app.bestDNA);
    setInnerHTML("mutationRate", ((app.mutationRate * 100).toFixed(2)) + "%" );
    setInnerHTML("bestFitness",'' + app.bestFitness + ((app.bestFitness == 1) ? "  *** GOAL REACHED! ***" : ""));
    setInnerHTML("gen0BestDNA",app.gen0BestDNA);

    setInnerHTML("bestRandom",app.randompop.best.genes);
    setInnerHTML("bestRandomFitness",app.randompop.best.fitness);
}
