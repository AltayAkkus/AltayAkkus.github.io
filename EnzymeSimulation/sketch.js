'use strict'
const width = window.innerWidth * (10/16)
const height = window.innerHeight * 0.75

const substratePopulation = 50
const enzymePopulation = 2

const dots = []
let reactions = 0
const enzymes = []
const substrates = []
const inactiveSubstrates = []

function setup() {
	var canvas = createCanvas(width, height)
	canvas.parent('sketch-holder');
	createPopulation()
}

function draw() {
	background(51)
	moveDots()
	updateText()
}

function updateText() {
	select('#reactions').html(`Reaktionen: ${reactions}`)
}

function checkComplete() {
	if (substratePopulation - inactiveSubstrates.length == 0) {
		noLoop()
	}
}

function moveDots() {
	for (const dot of dots) {
		if(dot.active) {
			dot.move()
			fill(dot.colour)
			dot.render()
			for (const dot2 of dots) {
				checkCollision(dot, dot2)
			}
		}
	}
}
//Checks if entitys collide
/*function checkCollision(dot, dot2) {
	//Calculates distance between dot and dot2, checks if the distance between is smaller than the size of the dots -> collision happened
	//If so checks if one of the dots is infected, then infects the other.
	if (dist(dot.pos.x, dot.pos.y, dot2.pos.x, dot2.pos.y) < dot.size 
		&& isOneInfected(dot, dot2)) {
		dot.infect()
	 	dot2.infect()
		infected.push(dot.infected)
	}
}*/
function checkCollision(dot, dot2) {
	//Calculates distance between dot and dot2, checks if the distance between is smaller than the size of the dots -> collision happened
	//If so checks if one of the dots is infected, then infects the other.
	if (dist(dot.pos.x, dot.pos.y, dot2.pos.x, dot2.pos.y) < dot.size 
		&& isOneEnzyme(dot, dot2) && dot.active && dot2.active) {
		console.log("Collision!")
		if(dot.enzyme) {
			//Do nothing to the enzyme
			deleteEntity(dot2)
			if(dot.reacted) {
				//Enzyme completed reaction
				console.log("Reaction complete")
				reactions += 1 
				dot.reacted = false 

				dot.colour = color(255, 0, 0)
			} else {
				console.log("Reacted = true")
				dot.reacted = true
				dot.colour = color(255, 193, 7)
			}
		} else {
			deleteEntity(dot)
			if(dot2.reacted) {
				//Enzyme completed reaction
				reactions += 1 
				dot2.reacted = false 
				dot2.colour = color(255, 0, 0)

			} else {
				dot2.reacted = true 
				dot2.colour = color(255, 193, 7)
			}
		}
	}
}
function isOneEnzyme(dot, dot2) {
	//Returns if one of the dots is an and enzyme, or if both are enzymes
	return (dot.enzyme || dot2.enzyme) && !areBothEnzymes(dot, dot2)
}
function areBothEnzymes(dot, dot2) {
	//Returns if both entitys are enzymes
	return dot.enzyme && dot2.enzyme
}
function deleteEntity(dot) {
	dot.active = false;
	inactiveSubstrates.push(dot)
	console.log("Entity deleted")
}
/*
function isOneInfected(dot, dot2) {
	return (dot.infected || dot2.infected) && !areBothInfected(dot, dot2)
}

function areBothInfected(dot, dot2) {
	return dot.infected && dot2.infected
}
*/
function createPopulation() {
 	for (let i = 0; i < substratePopulation; i++) {
		createSubstrate()
	}
	for(let i = 0; i < enzymePopulation; i++) {
		createEnzyme()
	}
}

function createEnzyme() {
	const enzyme = new Dot(new Coordinate(width, height), 32, true, false, true)
	dots.push(enzyme)
	enzymes.push(enzyme)
}

function createSubstrate() {
	const substrate = new Dot(new Coordinate(width, height), 32, false, false, true)
	dots.push(substrate)
	substrates.push(substrate)
}
function changeSpeed(speed) {
	for (const dot of dots) {
		dot.speed = new Coordinate(speed, speed)
	}
}
