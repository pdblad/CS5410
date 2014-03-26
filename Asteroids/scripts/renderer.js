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
			// check x boundry
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
	        spec.dy += Math.sin(spec.rotation) * 0.1;
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
