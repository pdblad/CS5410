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
		
		that.rotateRight = function(elapsedTime) {
			spec.rotation += spec.rotateRate * (elapsedTime / 1000);
		};
		
		that.rotateLeft = function(elapsedTime) {
			spec.rotation -= spec.rotateRate * (elapsedTime / 1000);
		};
		
//		that.moveLeft = function(elapsedTime) {
//			spec.center.x -= spec.moveRate * (elapsedTime / 1000);
//		};
//		
//		that.moveRight = function(elapsedTime) {
//			spec.center.x += spec.moveRate * (elapsedTime / 1000);
//		};
//		
//		that.moveUp = function(elapsedTime) {
//			spec.center.y -= spec.moveRate * (elapsedTime / 1000);
//		};
//		
//		that.moveDown = function(elapsedTime) {
//			spec.center.y += spec.moveRate * (elapsedTime / 1000);
//		};
		
		that.moveForward = function(elapsedTime){
			spec.center.x += spec.dx;
			spec.center.y += spec.dy;
			spec.dx *= .98;
			spec.dy *= .98;
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
	

	return {
		clear : clear,
		Texture : Texture
	};
}());
