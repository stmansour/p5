let dog;
let displayedImage;
let displayedImageName="dog.png"
let mappedImageName="dog100x100.jpg";

//               0         1         2
//               01234567890123456789012345678
const density = '#@W&8953752?1!=+-;:,.  ';
// const density = `$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,^\.    `;

function setInnerHTML(id,s) {
    let el = document.getElementById(id);
    if (el != null) {
        el.innerHTML = s;
    }
}

function preload() {
    displayedImage = loadImage(displayedImageName);

    dog = loadImage(mappedImageName);
}

function setup() {
  displayedImage.loadPixels();
  setInnerHTML("displayedImageName",displayedImageName);
  setInnerHTML("displayedImageSize"," " + displayedImage.width + " x " + displayedImage.height);
  dog.loadPixels();
  setInnerHTML("mappedImageName",mappedImageName);
  setInnerHTML("mappedImageSize"," " + dog.width + " x " + dog.height);
  setInnerHTML("densityChars",density);

  var canvas = createCanvas(displayedImage.width, displayedImage.height);
  canvas.parent("dogCanvas");

}

function smBrightness(r,g,b) {
    return (r + g + b) / 3;     // this is the simplest, but probably not the most accurate
}

function draw() {
    background(127);
    image(displayedImage,0,0,displayedImage.width,displayedImage.height);
    dog.loadPixels();
    noLoop();
    // image(displayedImage,0,0,displayedImage.width,displayedImage.height);

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
