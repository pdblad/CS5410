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
		
		var resetCount = 0;

		var wrap = function(){
			var xMax = ASTEROIDS.screenWidth, yMax = ASTEROIDS.screenHeight;
			// check x boundary
			if (spec.center.x !== Math.abs(5000) && spec.center.y !== Math.abs(5000)){
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
		
		that.getGunAngle = function(){
			return{
				x: Math.cos(spec.rotation),
				y: Math.sin(spec.rotation)
			};
		};
		
		that.getGunPos = function(){
			return {
				x : spec.center.x+(spec.height/2)*Math.cos(spec.rotation), 
				y : spec.center.y+(spec.height/2)*Math.sin(spec.rotation)
			};
		};
		
		that.getLeftThrusterPos = function(){
			return {
				x : spec.center.x+(spec.height/2)*-Math.cos(.5+spec.rotation), 
				y : spec.center.y+(spec.height/2)*-Math.sin(.5+spec.rotation)
			};
		};
		
		that.getRightThrusterPos = function(){
			return {
				x : spec.center.x+(spec.height/2)*-Math.cos(-.5+spec.rotation), 
				y : spec.center.y+(spec.height/2)*-Math.sin(-.5+spec.rotation)
			};
		};
		
		that.getThrusterStatus = function(){
			return spec.fireThrusters;
		};
		
		that.setThrusterStatus = function(status){
			spec.fireThrusters = status;
		};
		
		that.reset = function(elapsedTime){
//			if(resetCount <= 5){
				spec.image = ASTEROIDS.images['images/USU-Logo.png'];
				spec.center.x = ASTEROIDS.screenWidth/2;
				spec.center.y = ASTEROIDS.screenHeight/2;
				spec.width = 70;
				spec.height = 70;
				spec.rotation = -3.14;
				spec.rotateRate = 3.14159;
				spec.dx = 0;
				spec.dy = 0;
//			}
//			//Once you die three times, this exits to the main menu
//			else{
//				ASTEROIDS.screens['game-play'].cancelNextRequest = true;
//				ASTEROIDS.game.showScreen('main-menu');
//				resetCount = 0;
//			}
//			resetCount++;
		};
		
		that.removeAsteroid = function(){
			spec.center.x = 5000;
			spec.center.y = 5000;
			spec.rotation = 0;
			spec.moveRate = 0;
			spec.rotateRate = 0;
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
		
		that.rotateRight = function(elapsedTime) {
			spec.rotation += spec.rotateRate * (elapsedTime / 1000);
			//console.log('Rotation: ' + spec.rotation);
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
	        spec.fireThrusters = true;
		};
				
		that.asteroidMovement = function(direction, elapsedTime) {
			if(direction % 2 == 0){
				that.rotateRight(elapsedTime);
				that.moveRight(elapsedTime);
				that.moveDown(elapsedTime);
			}
			else{
				that.rotateLeft(elapsedTime);
				that.moveLeft(elapsedTime);
				that.moveUp(elapsedTime);
			}
			wrap();
		};
		
		that.explosion = function(elapsedTime){
			spec.image = ASTEROIDS.images['images/blueFire.png'];
			spec.width = 200;
			spec.height = 200;
			spec.rotateRate = 0;
			spec.dx = 0;
			spec.dy = 0;
		};
		
		that.updatePos = function(elapsedTime){
			spec.center.x += spec.dx;
			spec.center.y += spec.dy;
			//this is friction, uncomment if friction is wanted
			//spec.dx *= .98;
			//spec.dy *= .98;
			wrap();
		};
		
		that.updateEnemy = function(difficulty, elapsedTime){
			//that.rotateRight(elapsedTime);
			var randomnumber=Math.floor(Math.random()*4);
			if(randomnumber === 0)
				that.fireThrusters(elapsedTime);	
			else if(randomnumber === 1){
				for(var i = 0; i<10; i++)
					that.rotateLeft(elapsedTime);
			}
			else if (randomnumber === 2){
				for(var i = 0; i<10; i++)
					that.rotateRight(elapsedTime);
			}
			else{}
			that.updatePos(elapsedTime);
		};
		
		that.moveTo = function(x, y) {
			spec.center.x = x;
			spec.center.y = y;
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
	
    //code for rendering text
    function Text(spec) {
        var that = {};

        that.updateRotation = function(angle) {
            spec.rotation += angle;
        };

        function measureTextHeight(spec) {
            context.save();

            context.font = spec.font;
            context.fillStyle = spec.fill;
            context.strokeStyle = spec.stroke;

            var height = context.measureText('C').width;

            context.restore();

            return height;
        }

        function measureTextWidth(spec) {
            context.save();

            context.font = spec.font;
            context.fillStyle = spec.fill;
            context.strokeStyle = spec.stroke;

            var width = context.measureText(spec.text).width;

            context.restore();

            return width;
        }

        that.draw = function() {
            context.save();

            context.font = spec.font;
            context.fillStyle = spec.fill;
            context.strokeStyle = spec.stroke;
            context.textBaseline = 'top';

            context.translate(spec.pos.x + that.width / 2, spec.pos.y + that.height / 2);
            context.rotate(spec.rotation);
            context.translate(-(spec.pos.x + that.width / 2), -(spec.pos.y + that.height / 2));

            context.fillText(spec.text, spec.pos.x, spec.pos.y);
            context.strokeText(spec.text, spec.pos.x, spec.pos.y);

            context.restore();
        };

        that.height = measureTextHeight(spec);
        that.width = measureTextWidth(spec);
        that.pos = spec.pos;

        return that;
    }


	return {
		clear : clear,
		Texture : Texture,
		Text : Text,
		drawImage : drawImage
	};
}());
