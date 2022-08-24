/* jshint esversion: 6 */

let simulationActive = true;

function updateUI() {
    setInnerHTML("cycle",app.cycle);
    setInnerHTML("generation",app.population.generation);
    setInnerHTML("stats",lastGenStats());
}

function lastGenStats() {
    let s = "";
    if (app.results != null) {
        s = "Results for Generation " + (app.results.generation) + "<br>" +
        "Total population: " + app.population.fleetsize + "<br>" +
        "Successful: " + app.results.success;
    }
    return s;
}


function setInnerHTML(id,s) {
    let el = document.getElementById(id);
    if (el != null) {
        el.innerHTML = s;
    }
}

function startStop() {
    if (simulationActive) {
        simulationActive = false;
        noLoop();
    } else {
        simulationActive = true;
        loop();
    }
}
