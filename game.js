
function Game() {
var canvas = document.getElementById("game");
this.width = canvas.width;
this.height = canvas.height;
this.context = canvas.getContext("2d");
this.context.fillStyle = "white";
this.keys = new KeyListener();

this.p1 = new Paddle(5, 0);
this.p1.y = this.height/1 - this.p1.height/2;
this.display1 = new Display(this.width/4, 25);
this.p2 = new Paddle(this.width - 5 - 2, 0);
this.p2.y = this.height/1 - this.p2.height/2;
this.display2 = new Display(this.width*3/4, 25);

this.ball = new Ball();
this.ball.x = this.width/2;
this.ball.y = this.height/2;
this.ball.vy = Math.floor(Math.random()*12 - 6);
this.ball.vx = 7 - Math.abs(this.ball.vy);
}

Game.prototype.draw = function()
{
this.context.clearRect(0, 0, this.width, this.height); //todo change
this.context.fillRect(this.width/2, 0, 2, this.height);

this.ball.draw(this.context);

this.p1.draw(this.context);
this.p2.draw(this.context);
this.display1.draw(this.context);
this.display2.draw(this.context);
};

Game.prototype.update = function() 
{
if (this.paused)
return;

this.ball.update();
this.display1.value = this.p1.score;
this.display2.value = this.p2.score;

//GAME RESET on lose function  
if (this.p1.score + 5 == this.p2.score || this.p2.score + 5 == this.p1.score) {
this.p1.score = 0;
this.p2.score = 0;
stopAll();

}

// To which Y direction the paddle is moving
if (this.keys.isPressed(83)) { // DOWN
this.p1.y = Math.min(this.height - this.p1.height, this.p1.y + 12);
} else if (this.keys.isPressed(87)) { // UP
this.p1.y = Math.max(0, this.p1.y - 12);
}

if (this.keys.isPressed(40)) { // DOWN
this.p2.y = Math.min(this.height - this.p2.height, this.p2.y + 12);
} else if (this.keys.isPressed(38)) { // UP
this.p2.y = Math.max(0, this.p2.y - 12);
}

if (this.ball.vx > 0) {
if (this.p2.x <= this.ball.x + this.ball.width &&
this.p2.x > this.ball.x - this.ball.vx + this.ball.width) {
var collisionDiff = this.ball.x + this.ball.width - this.p2.x;
var k = collisionDiff/this.ball.vx;
var y = this.ball.vy*k + (this.ball.y - this.ball.vy);
if (y >= this.p2.y && y + this.ball.height <= this.p2.y + this.p2.height) {
// collides with right paddle
this.ball.x = this.p2.x - this.ball.width;
this.ball.y = Math.floor(this.ball.y - this.ball.vy + this.ball.vy*k);
this.ball.vx = -this.ball.vx;
}
}
} else {
if (this.p1.x + this.p1.width >= this.ball.x) {
var collisionDiff = this.p1.x + this.p1.width - this.ball.x;
var k = collisionDiff/-this.ball.vx;
var y = this.ball.vy*k + (this.ball.y - this.ball.vy);
if (y >= this.p1.y && y + this.ball.height <= this.p1.y + this.p1.height) {
// collides with the left paddle
this.ball.x = this.p1.x + this.p1.width;
this.ball.y = Math.floor(this.ball.y - this.ball.vy + this.ball.vy*k);
this.ball.vx = -this.ball.vx;
}
}
}

// Top and bottom collision
if ((this.ball.vy < 0 && this.ball.y < 0) ||
(this.ball.vy > 0 && this.ball.y + this.ball.height > this.height)) {
this.ball.vy = -this.ball.vy;
}

if (this.ball.x >= this.width)
this.score(this.p1);
else if (this.ball.x + this.ball.width <= 0)
this.score(this.p2);
};

Game.prototype.score = function(p)
{
// player scores
p.score++;
var player = p == this.p1 ? 0 : 1;

// set ball position
this.ball.x = this.width/2;
this.ball.y = p.y + p.height/2;

// set ball velocity
this.ball.vy = Math.floor(Math.random()*12 - 6);
this.ball.vx = 14 - Math.abs(this.ball.vy);
if (player == 1)
this.ball.vx *= -1;
};


// PADDLE
function Paddle(x,y) {
this.x = x;
this.y = y;
this.width = 4;
this.height = 56;
this.score = 0;
}

Paddle.prototype.draw = function(p)
{
p.fillRect(this.x, this.y, this.width, this.height);
};


// BALL
function Ball() {
this.x = 0;
this.y = 0;
this.vx = 0;
this.vy = 0;
this.width = 8;
this.height = 8;
}

Ball.prototype.update = function()
{
this.x += this.vx;
this.y += this.vy;
};

Ball.prototype.draw = function(p)
{
p.fillRect(this.x, this.y, this.width, this.height);
};


//DISPLAY
function Display(x, y) {
this.x = x;
this.y = y;
this.value = 0;
}

Display.prototype.draw = function(p)
{
p.fillText(this.value, this.x, this.y);
p.font='30px Arial';
};


// KEY LISTENER
function KeyListener() {
this.pressedKeys = [];

this.keydown = function(e) {
this.pressedKeys[e.keyCode] = true;
};

this.keyup = function(e) {
this.pressedKeys[e.keyCode] = false;
};

document.addEventListener("keydown", this.keydown.bind(this));
document.addEventListener("keyup", this.keyup.bind(this));
}

KeyListener.prototype.isPressed = function(key)
{
return this.pressedKeys[key] ? true : false;
};

KeyListener.prototype.addKeyPressListener = function(keyCode, callback)
{
document.addEventListener("keypress", function(e) {
if (e.keyCode == keyCode)
callback(e);
});
};

function stopAll() {
alert("GAME OVER!");
document.getElementById('startgamebtn').disabled = false;
document.getElementById('startgamebtn').style.visibility = 'visible';
document.getElementById('startgamebtn').innerHTML = "RESTART GAME";
this.p1.score = 0;
this.p2.score = 0;
setTimeout(MainLoop, 0);
}


// Initialize our game instance
var game = new Game();

function MainLoop() {
game.update();
game.draw();
// Call the main loop again at a frame rate of 30fps
setTimeout(MainLoop, 33.3333);
}
