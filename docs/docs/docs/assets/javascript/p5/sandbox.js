function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  var c = color(255, 204, Math.random() * 255);

  fill(c);

  ellipse(Math.random() * width, Math.random() * height, 80, 80);
}