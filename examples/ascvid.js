let video;
const density = '@#WRN987654321?!c=+^-,.  ';
// const density = `$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,^\.    `;

function setup() {
  noCanvas();
  video = createCapture(VIDEO);
  video.size(140,140);
}

function smBrightness(r,g,b) {
    return (r + g + b) / 3;     // this is the simplest, but probably not the most accurate
}

function draw() {
    const idxmax = density.length - 1;
    video.loadPixels();
    let s = "";
    for (var i = 0; i < video.height; i++) {
        for (var j = 0; j < video.width; j++) {
            const pixIndex = (i * video.width + j) * 4;
            const r = video.pixels[pixIndex + 0];
            const g = video.pixels[pixIndex + 1];
            const b = video.pixels[pixIndex + 2];
            const br = smBrightness(r,g,b);

            // br goes dimmest (0) to brightest (255).  So, reverse the mapping.
            const idx = floor(map(br,0,255,0,idxmax));
            if (density[idx] == " ") {
                s += "&nbsp;";
            } else {
                s += density[idx];
            }
        }
        s += "<br/>";
    }
    // update DOM:
    let el = document.getElementById("asciiart");
    if (el != null) {
        el.innerHTML = s;
    }
}
