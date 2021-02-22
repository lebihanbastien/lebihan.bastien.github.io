var coverWidth = document.getElementsByTagName('img')[0].offsetWidth;
var embedSize;

if(coverWidth <= 800) {
  embedSize = { width: coverWidth, height: 350 };
} else {
  embedSize = { width: 800, height: 450 };
}

var hyperspeed = function(p) {
  var stars = [];
  var warpStart = 60;
  var warpEnd = 240;
  var time = 0;

  var initialSpeed = 1.0005;
  var speed1 = 1.025;
  var speed2 = 1.06;

  p.setup = function() {
    let container = p.select('#p5-hyperspeed-container');
    p.createCanvas(embedSize.width, embedSize.height).parent(container);

    for (i = 0; i < 500; i++) {
      stars[i] = {
        posX1: Math.random() * p.width - p.width/2,
        posY1: Math.random() * p.height - p.height/2,
        size: p.map(Math.random(), 0, 1, 1, 3),
        color: Math.floor(Math.random() * 155) + 150
      }

      stars[i].posX2 = stars[i].posX1;
      stars[i].posY2 = stars[i].posY1;
    };
  }

  p.draw = function() {
    p.background(0,0,20);

    p.translate(p.width/2, p.height/2);

    stars.forEach(function(star) {
      p.stroke(star.color);
      p.strokeWeight(star.size);

      p.line(star.posX1, star.posY1, star.posX2, star.posY2);

      if (time < warpStart) {
        p.initial(star)
      } else if (time > warpEnd) {
        p.slowing(star);
      } else {
        p.accelerating(star)
      }
    });

    time++;

    if (time == 500) { time = 0; }
  }

  p.initial = function(star) {
    star.posX1 = initialSpeed*star.posX1;
    star.posY1 = initialSpeed*star.posY1;
    star.posX2 = initialSpeed*star.posX2;
    star.posY2 = initialSpeed*star.posY2;
  }

  p.accelerating = function(star) {
    star.posX1 = speed1*star.posX1;
    star.posY1 = speed1*star.posY1;
    star.posX2 = speed2*star.posX2;
    star.posY2 = speed2*star.posY2;

    if (Math.abs(star.posX1) > p.width/2 || Math.abs(star.posY1) > p.height/2) {
      star.posX1 = (Math.random() * p.width - p.width/2)/2;
      star.posY1 = (Math.random() * p.height - p.height/2)/2;
      star.posX2 = star.posX1;
      star.posY2 = star.posY1;
    }
  }

  p.slowing = function(star) {
    if (Math.abs(star.posX1) < Math.abs(star.posX2)) {
      star.posX1 = speed2*star.posX1;
    } else {
      star.posX1 = initialSpeed*star.posX2;
    }

    if (Math.abs(star.posY1) < Math.abs(star.posY2)) {
      star.posY1 = speed2*star.posY1;
    } else {
      star.posY1 = initialSpeed*star.posY2;
    }

    star.posX2 = initialSpeed*star.posX2;
    star.posY2 = initialSpeed*star.posY2;

    if (Math.abs(star.posX1) > p.width/2 || Math.abs(star.posY1) > p.height/2) {
      star.posX1 = (Math.random() * p.width - p.width/2);
      star.posY1 = (Math.random() * p.height - p.height/2);
      star.posX2 = star.posX1;
      star.posY2 = star.posY1;
    }
  }
}

var spinningParticles = function(p) {
  var system;
  var particles = [];

  p.setup = function() {
    let container = p.select('#p5-particles-container');
    p.createCanvas(embedSize.width, embedSize.height).parent(container);

    system = new ParticleSystem(p.createVector(p.width/2, p.height/2));
  }

  p.draw = function() {
    p.background(20);

    if (system.particles.length < 40) {
      system.addParticle();
    }

    system.run();
  }

  var Particle = function(position) {
    this.velocity = p.createVector(5, 5);
    this.position = position.copy();
    this.garbage = false;
  };

  Particle.prototype.run = function() {
    this.move();
    this.display();
  };

  Particle.prototype.move = function(){
    if (this.isInLandingArea()) {
      this.position.add(this.velocity);
    } else {
      this.garbage = true;
    }

    if (this.isBouncing()) {
      newVelocity = p.createVector(-this.velocity.x + p.random(-1, 1),
                                   -this.velocity.y + p.random(-1, 1));
      this.velocity = newVelocity;
      this.position.add(this.velocity);
    }

  };

  Particle.prototype.display = function() {
    p.strokeWeight(2);
    p.fill(255);
    p.ellipse(this.position.x, this.position.y, 10, 10);
  };

  Particle.prototype.isInLandingArea = function(){
    origin = system.origin

    var distance = p.sqrt(p.sq(this.position.x - origin.x) + p.sq(this.position.y - origin.y));

    return distance < p.height/4;
  };

  Particle.prototype.isBouncing = function(){
    origin = system.origin

    var distance = p.sqrt(p.sq(this.position.x - origin.x) + p.sq(this.position.y - origin.y));

    return distance >= p.height/4;
  }

  var ParticleSystem = function(position) {
    this.origin = position.copy();
    this.particles = [];
  };

  ParticleSystem.prototype.addParticle = function() {
    this.particles.push(new Particle(this.origin));
  };

  ParticleSystem.prototype.run = function() {
    for (var i = this.particles.length-1; i >= 0; i--) {
      var part = this.particles[i];
      part.run();

      if (part.garbage == true) {
        this.particles.splice(i, 1);
      }
    }
  };
}

var bubblingColors = function(p) {
  var table, origin, velocity;

  var baseSize = 12;
  var blueAreaSize = 6;
  var baseVelocity = 0.2;

  p.setup = function() {
    let container = p.select('#p5-colors-container');
    p.createCanvas(embedSize.width, embedSize.height).parent(container);

    table = new Table();
    velocity = baseVelocity;

    origin = {x: p.floor(table.columns/2), y: p.floor(table.rows/2)};

    for ( var i = 0; i < table.columns; i++ ) {
      for ( var j = 0; j < table.rows; j++ ) {
        cell = new Cell({x: i, y: j})

        if (cell.isInBlueArea(origin)) { cell.type = 'blue'; };

        table.cells.push(cell);
        cell.display();
      }
    }
  }

  p.draw = function() {
    p.moveBlueArea();

    for (step = 0; step < 2; step++) {
      p.updateRandomRedCell();
      p.updateRandomGreenCell();
    }
  }

  p.moveBlueArea = function() {
    if (p.floor(origin.x) == p.floor(table.columns*3/4)) {
      velocity = -baseVelocity;
    } else if (p.floor(origin.x) == p.floor(table.columns/4)) {
      velocity = baseVelocity;
    }

    origin.x = origin.x + velocity;

    table.cells.forEach(function(cell) {
      if (cell.isInBlueArea(origin) && cell.type !== 'blue') {
        cell.type = 'blue';
        cell.display();
      } else if (!cell.isInBlueArea(origin) && cell.type == 'blue') {
        cell.type = 'red';
        cell.display();
      }
    });
  }

  p.updateRandomRedCell = function() {
    var redCells = table.cells.filter(cell => cell.type === 'red');
    var randomRedCell = redCells[p.floor(p.random() * redCells.length)];

    randomRedCell.color = p.randomRedColor();
    randomRedCell.display();
  }

  p.updateRandomGreenCell = function() {
    var greenCells = table.cells.filter(cell => cell.type === 'green');
    var randomGreenCell = greenCells[p.floor(p.random() * greenCells.length)];

    if(randomGreenCell == null) { return; }

    randomGreenCell.color = p.randomGreenColor();
    randomGreenCell.display();
  }

  var Table = function() {
    this.columns = p.floor(p.width/baseSize);
    this.rows = p.floor(p.height/baseSize);
    this.cells = [];
  }

  var Cell = function(position) {
    this.position = position;
    this.color = p.randomRedColor();
    this.width = p.width/table.columns;
    this.height = p.height/table.rows;
    this.type = 'red';
  };

  Cell.prototype.display = function() {
    switch(this.type) {
      case 'blue':
        this.color = p.randomBlueColor();
        strokeColor = p.randomBlueColor();
        break;
      case 'red':
        this.color = p.randomRedColor();
        strokeColor = p.randomRedColor();
        break;
      case 'green':
        this.color = p.randomGreenColor();
        strokeColor = p.randomGreenColor();
    }

    p.fill(this.color.r, this.color.g, this.color.b);
    p.stroke(strokeColor.r, strokeColor.g, strokeColor.b);

    p.rect(this.position.x * this.width,
           this.position.y * this.height,
           this.width + 1,
           this.height + 1);
  };

  Cell.prototype.isInBlueArea = function(origin) {
    var distance = p.sqrt(p.sq(this.position.x - origin.x) +
                          p.sq(this.position.y - origin.y));

    return distance < blueAreaSize;
  };

  p.randomRedColor = function() {
    return {r: 255, g: p.random(0, 170), b: p.random(0, 100)};
  }

  p.randomBlueColor = function() {
    return {r: p.random(100, 200), g: p.random(100, 200), b: 255};
  }

  p.randomGreenColor = function() {
    return {r: p.random(0, 200), g: 255, b: p.random(0, 200)};
  }

  p.mouseMoved = function() {
    cellX = p.floor(p.mouseX/table.cells[0].width);
    cellY = p.floor(p.mouseY/table.cells[0].height);

    overredCells = table.cells.filter(cell => cell.position.x > cellX - 2 &&
                                              cell.position.x < cellX + 2 &&
                                              cell.position.y > cellY - 2 &&
                                              cell.position.y < cellY + 2);

    overredCells.forEach(function(cell) {
      cell.type = 'green';
      cell.display();
    });
  }

  p.mouseDragged = function() {
    cellX = p.floor(p.mouseX/table.cells[0].width);
    cellY = p.floor(p.mouseY/table.cells[0].height);

    overredCells = table.cells.filter(cell => cell.position.x > cellX - 2 &&
                                              cell.position.x < cellX + 2 &&
                                              cell.position.y > cellY - 2 &&
                                              cell.position.y < cellY + 2);

    overredCells.forEach(function(cell) {
      cell.type = 'red';
      cell.display();
    });
  }
}

var myp5 = new p5(hyperspeed, '.container');
var myp5 = new p5(spinningParticles, '.container');
var myp5 = new p5(bubblingColors, '.container');
