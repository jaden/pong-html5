var animate = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function(callback) { window.setTimeout(callback, 1000/60) };

var canvas = document.createElement('canvas');
var width = 800;
var height = 600;
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');

window.onload = function() {
    document.body.appendChild(canvas);
    animate(step);
};

var step = function() {
    update();
    render();
    animate(step);
};

var update = function() {
    player.update();
    computer.update(ball);
    ball.update(player.paddle, computer.paddle);
};

Player.prototype.update = function() {
    for (var key in keysDown) {
        var value = Number(key);
        if (value == 13) { // Enter key
            ball.x_speed = -5;
        } else if (value == 38) { // up arrow
            this.paddle.move(0, -4);
        } else if (value == 40) { // down arrow
            this.paddle.move(0, 4);
        } else {
            this.paddle.move(0, 0);
        }
    }
};

Computer.prototype.update = function(ball) {
    var y_pos = ball.y;
    var diff = -((this.paddle.y + (this.paddle.width / 2)) - y_pos);
    if (diff < 0 && diff < -4) { // max speed up
        diff = -5;
    } else if (diff > 0 && diff > 4) { // max speed down
        diff = 5;
    }
    this.paddle.move(0, diff);
    if (this.paddle.y < 0) {
        this.paddle.y = 0;
    } else if (this.paddle.y + this.paddle.height > height) {
        this.paddle.y = height - this.paddle.height;
    }
};

Paddle.prototype.move = function(x, y) {
    this.x += x;
    this.y += y;
    this.x_speed = x;
    this.y_speed = y;
    if (this.y < 0) { // all the way up
        this.y = 0;
        this.y_speed = 0;
    } else if (this.y + this.height > height) { // all the way down
        this.y = height - this.height;
        this.y_speed = 0;
    }
}

var render = function() {
    context.fillStyle = "#000000";
    context.fillRect(0, 0, width, height);
};

var paddleWidth = 10;
var paddleHeight = 50;

function Paddle(x, y) {
    this.x = x;
    this.y = y;
    this.width = paddleWidth;
    this.height = paddleHeight;
    this.x_speed = 0;
    this.y_speed = 0;
}

Paddle.prototype.render = function() {
    context.fillStyle = "#FFFFFF";
    context.fillRect(this.x, this.y, this.width, this.height);
};

function Player() {
    this.paddle = new Paddle(10, (height - paddleHeight) / 2);
}

function Computer() {
    this.paddle = new Paddle(width-20, (height - paddleHeight) / 2);
}

Player.prototype.render = function() {
    this.paddle.render();
};

Computer.prototype.render = function() {
    this.paddle.render();
};

function Ball() {
    this.x = width / 2;
    this.y = height / 2;
    this.x_speed = 0;
    this.y_speed = 0;
    this.radius = 5;
}

Ball.prototype.render = function() {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
    context.fillStyle = "#FFFFFF";
    context.fill();
};

Ball.prototype.update = function(paddle1, paddle2) {
    this.x += this.x_speed;
    this.y += this.y_speed;
    
    var left_x = this.x - 5;
    var left_y = this.y - 5;
    var right_x = this.x + 5;
    var right_y = this.y + 5;
    
    if (this.y - 5 < 0) { // hitting the bottom wall
        this.y = 5;
        this.y_speed = -this.y_speed;
    } else if (this.y + 5 > height) { // hitting the top wall
        this.y = height - 5;
        this.y_speed = -this.y_speed;
    }

    if (this.x < 0 || this.x > width) { // a point was scored
        // Reset the ball location
        this.x = width / 2;
        this.y = height / 2;
        this.x_speed = 0;
        this.y_speed = 0;
    }

    if (left_x < width / 2) {
        if (left_x < (paddle1.x + paddle1.width) && right_x > paddle1.x && left_y < (paddle1.y + paddle1.height) && right_y > paddle1.y) {
          // hit the left paddle
          this.x_speed = 5;
          this.y_speed += (paddle1.y_speed / 2);
          this.x += this.x_speed;
        }
    } else {
        if (left_x < (paddle2.x + paddle2.width) && right_x > paddle2.x && left_y < (paddle2.y + paddle2.height) && right_y > paddle2.y) {
            // hit the right paddle
            this.x_speed = -5;
            this.y_speed += (paddle2.y_speed / 2);
            this.x += this.x_speed;
        }
    }
};

var keysDown = {};

window.addEventListener("enter", function(event) {
    keysDown[event.keyCode] = true;
});

window.addEventListener("keydown", function(event) {
    keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event) {
    delete keysDown[event.keyCode];
});

var player = new Player();
var computer = new Computer();
var ball = new Ball();

var render = function() {
    context.fillStyle = "#000000";
    context.fillRect(0, 0, width, height);
    player.render();
    computer.render();
    ball.render();
};