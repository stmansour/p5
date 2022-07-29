let dog;
// let dogview;
//               0         1         2
//               01234567890123456789012345678
const density = '@#W&8953752?1!=+-;:,.  ';
// const density = `$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,^\.    `;

function preload() {
    dog = loadImage("dog100x100.jpg");
    dogview = loadImage("dog.png");
}

function setup() {
  createCanvas(300, 300);
}

function smBrightness(r,g,b) {
    return (r + g + b) / 3;     // this is the simplest, but probably not the most accurate
}

function draw() {
    background(127);
    image(dogview,0,0,dogview.width,dogview.height);
    dog.loadPixels();
    noLoop();
    // image(dogview,0,0,dogview.width,dogview.height);

    let w = width / dog.width;
    let h = height / dog.height;
    let hw = w/2;

    const idxmax = density.length - 1;
    let s = "";
    for (var i = 0; i < dog.height; i++) {
        for (var j = 0; j < dog.width; j++) {
            const pixIndex = (i * dog.width + j) * 4;
            const r = dog.pixels[pixIndex + 0];
            const g = dog.pixels[pixIndex + 1];
            const b = dog.pixels[pixIndex + 2];

            noStroke();

            // a)  use exact color of image
            // fill(r,g,b);

            // b)  use brightness of the color
            const br = smBrightness(r,g,b);
            // fill(br);

            // 1.  A filled square with the brightness
            //square(j*w, i*h, w);

            // 2.  A character set to the brightness
            // textSize(w);
            // textAlign(CENTER,CENTER);
            //text("A", j*w + hw, i*h + hw );

            // 3. choose a density character based on the brightness...
            //    NOTE: density goes brightest to dimmest, while br goes
            //          dimmest (0) to brightest (255).  So, reverse the mapping.
            // fill(255);  // white
            const idx = floor(map(br,0,255,0,idxmax));
            // text(density[idx], j*w + hw, i*h + hw );

            // 4. pure ascii to DOM
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
