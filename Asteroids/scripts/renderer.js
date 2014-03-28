/*jslint browser: true, white: true */
/*global CanvasRenderingContext2D, ASTEROIDS */
// ------------------------------------------------------------------
//
//
// ------------------------------------------------------------------

ASTEROIDS.graphics = (function() {
	'use strict';
	
	var canvas = document.getElementById('mainCanvas'),
		context = canvas.getContext('2d');
	ASTEROIDS.screenWidth = canvas.width = window.innerWidth;
	ASTEROIDS.screenHeight = canvas.height = window.innerHeight;
	
	//
	// Place a 'clear' function on the Canvas prototype, this makes it a part
	// of the canvas, rather than making a function that calls and does it.
	CanvasRenderingContext2D.prototype.clear = function() {
		this.save();
		this.setTransform(1, 0, 0, 1, 0, 0);
		this.clearRect(0, 0, canvas.width, canvas.height);
		this.restore();
	};
	
	function clear() {
		context.clear();
	}
	
	function Texture(spec) {
		var that = {};
		
		var wrap = function(){
			var xMax = ASTEROIDS.screenWidth, yMax = ASTEROIDS.screenHeight;
			// check x boundary
			if (spec.center.x > xMax) {
				spec.center.x -= xMax;
			} else if (spec.center.x < 0) {
				spec.center.x += xMax;
			}
			// check y bounds
			if (spec.center.y > yMax) {
				spec.center.y -= yMax;
			} else if (spec.center.y < 0) {
				spec.center.y += yMax;
			}
		};
		
		that.getWidth = function(){
			return spec.width;
		};
		
		that.getHeight = function(){
			return spec.height;
		};
		
		that.getRadius = function(){
			return spec.height/2;
		};
		
		that.getX = function(){
			return spec.center.x;
		};
		
		that.getY = function(){
			return spec.center.y;
		};
		
		that.getRotation = function(){
			return spec.rotation;
		};
		
		that.getDx = function(){
			return spec.dx;
		};
		
		that.getDy = function(){
			return spec.dy;
		};
		
		that.reset = function(elapsedTime){
			spec.center.x = ASTEROIDS.screenWidth/2;
			spec.center.y = ASTEROIDS.screenHeight/2;
			spec.rotation = -3.14;
			spec.rotateRate = 3.14159;
			spec.dx = 0;
			spec.dy = 0;
		};
		
		that.moveLeft = function(elapsedTime) {
			spec.center.x -= spec.moveRate * (elapsedTime / 1000);
		};
		
		that.moveRight = function(elapsedTime) {
			spec.center.x += spec.moveRate * (elapsedTime / 1000);
		};
		
		that.moveUp = function(elapsedTime) {
			spec.center.y -= spec.moveRate * (elapsedTime / 1000);
		};
		
		that.moveDown = function(elapsedTime) {
			spec.center.y += spec.moveRate * (elapsedTime / 1000);
			wrap();
		};
		
		that.asteroidMovement = function(direction, elapsedTime) {
			if(direction <= 5){
				that.rotateRight(elapsedTime);
				that.moveRight(elapsedTime);
				that.moveDown(elapsedTime);
			}
			else if (direction > 5 && direction <= 10){
				that.rotateLeft(elapsedTime);
				that.moveUp(elapsedTime);
			}
			else if (direction > 10 && direction <= 15){
				that.rotateLeft(elapsedTime);
				spec.center.y = ASTEROIDS.screenHeight/2;
				that.moveRight(elapsedTime);
			}
			else{
				that.rotateRight(elapsedTime);
				spec.center.y = ASTEROIDS.screenHeight/4;
				that.moveLeft(elapsedTime);
			}
			wrap();
		};
		
		that.rotateRight = function(elapsedTime) {
			spec.rotation += spec.rotateRate * (elapsedTime / 1000);
		};
		
		that.rotateLeft = function(elapsedTime) {
			spec.rotation -= spec.rotateRate * (elapsedTime / 1000);
			//console.log('Rotation: ' + spec.rotation);
		};
		
		that.fireThrusters = function(elapsedTime){
			spec.dx += Math.cos(spec.rotation) * 0.1;
//			console.log("dx value: " + spec.dx);
	        spec.dy += Math.sin(spec.rotation) * 0.1;
//	        console.log("dy value: " + spec.dy);
		};
		
		that.shoot = function(elapsedTime){
			//Shoot bullets
		};
		
		that.updatePos = function(elapsedTime){
			spec.center.x += spec.dx;
			spec.center.y += spec.dy;
			//this is friction, uncomment if friction is wanted
			//spec.dx *= .98;
			//spec.dy *= .98;
			wrap();
		};
		
		that.moveTo = function(center) {
			spec.center = center;
		};
		
		that.draw = function() {
			context.save();
			
			context.translate(spec.center.x, spec.center.y);
			context.rotate(spec.rotation);
			context.translate(-spec.center.x, -spec.center.y);
			
			context.drawImage(
				spec.image, 
				spec.center.x - spec.width/2, 
				spec.center.y - spec.height/2,
				spec.width, spec.height);
			
			context.restore();
		};
		
		return that;
	}
	
	//------------------------------------------------------------------
	//
	// Expose an ability to draw an image/texture on the canvas.
	//
	//------------------------------------------------------------------
	function drawImage(spec) {
		context.save();
		
		context.translate(spec.center.x, spec.center.y);
		context.rotate(spec.rotation);
		context.translate(-spec.center.x, -spec.center.y);
		
		context.drawImage(
			spec.image, 
			spec.center.x - spec.size/2, 
			spec.center.y - spec.size/2,
			spec.size, spec.size);
		
		context.restore();
	}

	return {
		clear : clear,
		Texture : Texture,
		drawImage : drawImage
	};
}());
