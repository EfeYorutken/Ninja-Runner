const canvas : HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const c : CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;

const player_skin_color = "rgba(0,0,28,1)";
const player_band_color = "rgba(255,0,0,1)";
const bg_color = "rgba(0,0,100,0.6)";
const bg_color_loose = "rgba(0,0,100,0.8)";
const text_color = "rgba(255,0,0,1)";
const text_color_loose = "rgba(255,255,0,1)";
const text = "Press <Enter> to reverse gravity\nPress <Space> to jump\nDONT GET HIT BY THE BLOCKS"
const player_height = canvas.height/10;
const player_width = canvas.width/10;
const eye_lvl = player_height/5;
const band_height = 20;
const g = 0.05;
const jump_force = 20;
const obsticle_color = "rgba(0,0,0,1)";
const obsticle_height = canvas.height / 3;
const obs_touching = new Event("obs_touching");
const upper_speed = 5;

let current_g = g;
let obs_speed = 5;

const apply_force = (n : ninja,force : number)=>{
	n.dy += force;
}


class obsticle{
	x : number;
	y : number;
	width : number;
	constructor(width : number, station : number){
		this.x = canvas.width + 1;
		this.width = width;
		if(station % 2 == 0){this.y = 0;}
		else if(station % 3 == 0){this.y = obsticle_height;}
		else {this.y = obsticle_height * 2;}
	}
	move = (dx : number)=>{
		this.x += dx;
	}
	draw = ()=>{
		c.fillStyle = obsticle_color;
		c.fillRect(this.x,this.y,this.width, obsticle_height);
	}
}



class ninja{
	x : number;
	y : number;
	dy : number;
	width : number;
	height : number;
	direction : number;
	score : number;
	constructor(x : number, y : number, width : number, height: number){
		this.x  = x;
		this.y  = y;
		this.dy  = 0;
		this.width  = width;
		this.height  = height;
		this.direction  = 1;
		this.score = 0;
	}

	draw = ()=>{
		if(this.direction == 1){
			c.fillStyle = player_skin_color;
			c.fillRect(this.x,this.y,this.width,this.height);
			c.fillStyle = player_band_color;
			c.fillRect(this.x,this.y + eye_lvl,this.width,band_height);
		}
		else{
			c.fillStyle = player_skin_color;
			c.fillRect(this.x,this.y,this.width,this.height);
			c.fillStyle = player_band_color;
			c.fillRect(this.x,this.y + this.height - eye_lvl - band_height,this.width,band_height);
		}
	}

	move = ()=>{
		this.y += this.dy;
	}

	adjust_y = ()=>{
		if(this.y < 0){this.y = 0;}
		if(this.y > canvas.height - this.height) {this.y = canvas.height - this.height;}
	}

	jump = ()=>{
		if((this.direction == -1 && this.y == 0) || (this.direction == 1 && this.y == canvas.height - this.height)){
			apply_force(this,jump_force * this.direction * -1);
		}
	}

}

let n = new ninja(20,20,player_width,player_height);

let obs = new obsticle(Math.floor(Math.random() * (canvas.width - player_width)), Math.floor(Math.random() * 3) +1);

document.addEventListener("keypress",(event)=>{
	if(event.key == " "){
		n.jump();
	}
	if(event.key == "Enter"){
		current_g = -current_g;
		n.dy = 0;
		n.direction = -n.direction;
	}
});



const anim = ()=>{
	const frame_id = requestAnimationFrame(anim);
	c.fillStyle = bg_color
	c.fillRect(0,0,canvas.width,canvas.height);
	c.fillStyle = text_color;
	c.font = "30px Arial";
	c.fillText(text,10,50);
	n.draw();
	n.move();
	apply_force(n, current_g);
	if(n.dy > upper_speed){
		n.dy = upper_speed;
	}
	if(n.dy < -upper_speed){
		n.dy = -upper_speed;
	}
	n.adjust_y();
	obs.draw();
	if(obs.x + obs.width <= 0){
		obs = new obsticle(Math.floor(Math.random() * (canvas.width - player_width)), Math.floor(Math.random() * 3) +1);
		n.score++;
	}
	if(
		n.x > obs.x
	&&
		n.x < obs.x + obs.width
	&&
		n.y > obs.y
	&&
		n.y < obs.y + obsticle_height
	){
		c.fillStyle = bg_color_loose;
		c.fillRect(0,0,canvas.width,canvas.height);
		c.fill();
		c.font = "60px Arial";
		c.fillStyle = text_color_loose;
		c.fillText(`YOU GOT ${n.score} points`,canvas.width/4,canvas.height/4);
		cancelAnimationFrame(frame_id);
	}
	obs.move(-obs_speed);
	obs_speed += 0.001;
}

anim();
