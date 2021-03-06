var pumpkinImages = [
  "https://i.imgur.com/x6DeXSP.png",
  "https://i.imgur.com/jiLxvQC.png",
  "https://i.imgur.com/MKMIEAj.png",
  "https://i.imgur.com/ufguJsr.png"
].map(function(url) {
  var el = document.createElement('img');
  el.src = url;
  return el;
});

var pumpkinIndex = 0;

var pumpkinImageEl = document.getElementById('asteroid');

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

var field = document.getElementById("field");
var f = field.getContext("2d");

var stars = new Set();
var starIndex = 0;
var numStars = 0;
var acceleration = 1;
var starsToDraw = (field.width * field.height) / 500;
if (getUrlParameter("stars")) {
  starsToDraw = getUrlParameter("stars");
}
if (getUrlParameter("accel")) {
  acceleration = getUrlParameter("accel");
}


function Star() {
    this.X = field.width / 2;
    this.Y = field.height / 2;

    this.SX = Math.random() * 10 - 5;
    this.SY = Math.random() * 10 - 5;

    var start = 0;

    if (field.width > field.height)
        start = field.width;
    else
        start = field.height;

    this.X += this.SX * start / 10;
    this.Y += this.SY * start / 10;

    if (Math.random() < 0.02) {
      this.image = pumpkinImages[pumpkinIndex =
        (pumpkinIndex + 1) % pumpkinImages.length];
      this.W = 20;
      this.H = 20;
    } else {
    this.W = 1;
    this.H = 1;

    }

    this.age = 0;
    this.dies = 500;

    stars.add(this);

    this.ID = starIndex;
    this.C = "#ffffff";

}

Star.prototype.Draw = function () {
    this.X += this.SX;
    this.Y += this.SY;

    this.SX += this.SX / (50 / acceleration);
  	this.SY += this.SY / (50 / acceleration);

    this.age++;

    var starGrowFactor = this.image? 50 : 1;

    this.W = this.H = Math.max(1, this.age * starGrowFactor / 75);

    if (this.X + this.W < 0 | this.X > field.width |
        this.Y + this.H < 0 | this.Y > field.height)
      {
        stars.delete(this);
			}

    f.fillStyle = this.C;
    if (this.image) {
      f.drawImage(this.image, this.X, this.Y, this.W, this.H);
    } else {
      f.fillRect(this.X, this.Y, this.W, this.H);
    }
}

field.width = window.innerWidth;
field.height = window.innerHeight;

function draw() {
  	if (field.width != window.innerWidth)
      	field.width = window.innerWidth;
  	if (field.height != window.innerHeight)
      	field.height = window.innerHeight;

  	// Play with the "a" value to create streams...it's fun!
    f.fillStyle = "rgba(0, 0, 0, 0.8)";
    f.fillRect(0, 0, field.width, field.height);

    for (var i = stars.size; i < starsToDraw; i++) {
        new Star();
    }

    for (var star of stars) {
        star.Draw();
    }
}

// Original timing of the screensaver
setInterval(draw, 40);
