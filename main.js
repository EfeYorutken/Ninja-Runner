var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext("2d");
var player_skin_color = "rgba(0,0,28,1)";
var player_band_color = "rgba(255,0,0,1)";
var bg_color = "rgba(0,0,100,0.6)";
var bg_color_loose = "rgba(0,0,100,0.8)";
var text_color = "rgba(255,0,0,1)";
var text_color_loose = "rgba(255,255,0,1)";
var text = "Press <Enter> to reverse gravity\nPress <Space> to jump\nDONT GET HIT BY THE BLOCKS";
var player_height = canvas.height / 10;
var player_width = canvas.width / 10;
var eye_lvl = player_height / 5;
var band_height = 20;
var g = 0.05;
var jump_force = 20;
var obsticle_color = "rgba(0,0,0,1)";
var obsticle_height = canvas.height / 3;
var obs_touching = new Event("obs_touching");
var upper_speed = 5;
var current_g = g;
var obs_speed = 5;
var apply_force = function (n, force) {
    n.dy += force;
};
var obsticle = /** @class */ (function () {
    function obsticle(width, station) {
        var _this = this;
        this.move = function (dx) {
            _this.x += dx;
        };
        this.draw = function () {
            c.fillStyle = obsticle_color;
            c.fillRect(_this.x, _this.y, _this.width, obsticle_height);
        };
        this.x = canvas.width + 1;
        this.width = width;
        if (station % 2 == 0) {
            this.y = 0;
        }
        else if (station % 3 == 0) {
            this.y = obsticle_height;
        }
        else {
            this.y = obsticle_height * 2;
        }
    }
    return obsticle;
}());
var ninja = /** @class */ (function () {
    function ninja(x, y, width, height) {
        var _this = this;
        this.draw = function () {
            if (_this.direction == 1) {
                c.fillStyle = player_skin_color;
                c.fillRect(_this.x, _this.y, _this.width, _this.height);
                c.fillStyle = player_band_color;
                c.fillRect(_this.x, _this.y + eye_lvl, _this.width, band_height);
            }
            else {
                c.fillStyle = player_skin_color;
                c.fillRect(_this.x, _this.y, _this.width, _this.height);
                c.fillStyle = player_band_color;
                c.fillRect(_this.x, _this.y + _this.height - eye_lvl - band_height, _this.width, band_height);
            }
        };
        this.move = function () {
            _this.y += _this.dy;
        };
        this.adjust_y = function () {
            if (_this.y < 0) {
                _this.y = 0;
            }
            if (_this.y > canvas.height - _this.height) {
                _this.y = canvas.height - _this.height;
            }
        };
        this.jump = function () {
            if ((_this.direction == -1 && _this.y == 0) || (_this.direction == 1 && _this.y == canvas.height - _this.height)) {
                apply_force(_this, jump_force * _this.direction * -1);
            }
        };
        this.x = x;
        this.y = y;
        this.dy = 0;
        this.width = width;
        this.height = height;
        this.direction = 1;
        this.score = 0;
    }
    return ninja;
}());
var n = new ninja(20, 20, player_width, player_height);
var obs = new obsticle(Math.floor(Math.random() * (canvas.width - player_width)), Math.floor(Math.random() * 3) + 1);
document.addEventListener("keypress", function (event) {
    if (event.key == " ") {
        n.jump();
    }
    if (event.key == "Enter") {
        current_g = -current_g;
        n.dy = 0;
        n.direction = -n.direction;
    }
});
var anim = function () {
    var frame_id = requestAnimationFrame(anim);
    c.fillStyle = bg_color;
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = text_color;
    c.font = "30px Arial";
    c.fillText(text, 10, 50);
    n.draw();
    n.move();
    apply_force(n, current_g);
    if (n.dy > upper_speed) {
        n.dy = upper_speed;
    }
    if (n.dy < -upper_speed) {
        n.dy = -upper_speed;
    }
    n.adjust_y();
    obs.draw();
    if (obs.x + obs.width <= 0) {
        obs = new obsticle(Math.floor(Math.random() * (canvas.width - player_width)), Math.floor(Math.random() * 3) + 1);
        n.score++;
    }
    if (n.x > obs.x
        &&
            n.x < obs.x + obs.width
        &&
            n.y > obs.y
        &&
            n.y < obs.y + obsticle_height) {
        c.fillStyle = bg_color_loose;
        c.fillRect(0, 0, canvas.width, canvas.height);
        c.fill();
        c.font = "60px Arial";
        c.fillStyle = text_color_loose;
        c.fillText("YOU GOT ".concat(n.score, " points"), canvas.width / 4, canvas.height / 4);
        cancelAnimationFrame(frame_id);
    }
    obs.move(-obs_speed);
    obs_speed += 0.001;
};
anim();
