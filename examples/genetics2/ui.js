/* jshint esversion: 6 */

function updateUI() {
    setInnerHTML("cycle",app.idx);
}

function setInnerHTML(id,s) {
    let el = document.getElementById(id);
    if (el != null) {
        el.innerHTML = s;
    }
}
