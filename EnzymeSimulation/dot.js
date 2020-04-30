'use strict'

class Dot {
	//Constructs shape
	constructor(canvas, size, enzyme, reacted, active) {
		this.pos = startLocation(canvas.x, canvas.y)
		this.speed = new Coordinate(1,1)
		this.direction = randCoordinate()
		//Checks if dot is enzyme, if so changes color
		this.colour = enzyme ? color(255, 0, 0) : color(255, 255, 255)
		this.canvas = canvas
		this.size = size
		this.enzyme = enzyme
		this.reacted = reacted
		this.active = active
	}

	move() {
		this.checkBoundaries()
		this.pos = new Coordinate(this.pos.x + this.speed.x * this.direction.x, this.pos.y + this.speed.y * this.direction.y)
	}
	//If the shape collides with a wall, the direction is reverted
	checkBoundaries() {
		if (hitBoundary(this, 'x')) {
			this.direction.x *= -1
		}
		if (hitBoundary(this, 'y')) {
			this.direction.y *= -1
		}
	}
	//Renders a circle
	render() {
		if(this.enzyme) {
			rect(this.pos.x, this.pos.y, this.size * 1.5, this.size * 0.75)
		} else {
			ellipse(this.pos.x, this.pos.y, this.size)
		}
	}



}

function hitBoundary(dot, axis) {
	if(dot.enzyme) {
		if(axis == "x") {
			return dot.pos[axis] > dot.canvas[axis] - (dot.size) || dot.pos[axis] < (dot.size) 
		} else {
			return dot.pos[axis] > dot.canvas[axis] - (dot.size) || dot.pos[axis] < (dot.size) 
		}
	} else {
		return dot.pos[axis] > dot.canvas[axis] - dot.size || dot.pos[axis] < dot.size 
	}
}

function startLocation(x, y) {
	console.log(x)
	console.log(y)

	return new Coordinate(randRange(x, 30), randRange(y, 50))
}

function randRange(max, min) {
	return Math.ceil(Math.random() * (max - min) + min)
}

function rand(constraint) {
	return Math.ceil(Math.random() * constraint)
}

function randCoordinate() {
	return new Coordinate(rand(2), rand(2))
}
