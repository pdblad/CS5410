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
		
		var resetCount = 0,
			enemyFireCount = 0,
			rotateCount = 0;

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
		
		that.getPos = function(){
			return spec.center;
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
		
		that.getSize = function(){
			return spec.size;
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
		
	    that.getDiff = function(){
	    	return spec.diff;
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
		
		that.removeAsteroid = function(){
			var oldX = that.getX(),
				oldY = that.getY();
			spec.center.x = 5000;
			spec.center.y = 5000;
			spec.rotation = 0;
			spec.moveRate = 0;
			spec.rotateRate = 0;
			return {x: oldX, y: oldY};
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
				
		that.asteroidMovement = function(elapsedTime) {
			if(spec.direction == 1){
				that.rotateRight(elapsedTime);
				that.moveRight(elapsedTime);
				that.moveDown(elapsedTime);
			}
			else if(spec.direction == 2){
				that.rotateRight(elapsedTime);
				that.moveLeft(elapsedTime);
				that.moveLeft(elapsedTime);
				that.moveUp(elapsedTime);
			}
			else if(spec.direction == 3){
				that.rotateLeft(elapsedTime);
				that.moveRight(elapsedTime);
				that.moveUp(elapsedTime);
				that.moveUp(elapsedTime);
				that.moveUp(elapsedTime);
			}
			else if(spec.direction == 4){
				that.rotateLeft(elapsedTime);
				that.moveLeft(elapsedTime);
				that.moveLeft(elapsedTime);
				that.moveDown(elapsedTime);
			}
			else{
				that.rotateRight(elapsedTime);
				that.moveRight(elapsedTime);
				that.moveRight(elapsedTime);
				that.moveUp(elapsedTime);
			}

			wrap();
		};
		
		that.shipHit = function(){
			spec.width = 0;
			spec.height = 0;
			spec.rotateRate = 0;
			spec.dx = 0;
			spec.dy = 0;
			that.moveTo(5000, 5000);
		};
		
		that.reset = function(elapsedTime){
			spec.image = ASTEROIDS.images['images/USU-Logo.png'];
			spec.center.x = ASTEROIDS.screenWidth/2;
			spec.center.y = ASTEROIDS.screenHeight/2;
			spec.width = 70;
			spec.height = 70;
			spec.rotation = -3.14;
			spec.rotateRate = 3.14159;
			spec.dx = 0;
			spec.dy = 0;
		};
		
		that.updatePos = function(){
			spec.center.x += spec.dx;
			spec.center.y += spec.dy;
			//this is friction, uncomment if friction is wanted
			//spec.dx *= .98;
			//spec.dy *= .98;
			wrap();
		};
		
		that.updateEnemy = function(ship, gun, elapsedTime){
			//update ship movement
			spec.center.x += (spec.speed * spec.direction.x);
			spec.center.y += (spec.speed * spec.direction.y);
			
			rotateCount += elapsedTime;
			enemyFireCount += elapsedTime;
			
			gun.updatePos({x: ship.getGunPos().x, y: ship.getGunPos().y}, ship.getRotation());
			gun.updatePos({x: ship.getGunPos().x, y: ship.getGunPos().y}, ship.getRotation());
			
			//what to do with the harder ufo
			if(spec.diff === 'hard'){
				//fire n000 seconds
				if(enemyFireCount >= 1000){
					gun.create();
					enemyFireCount = 0;
				}
				//rotate ship every so often
				if(rotateCount >= 100){
					that.rotateLeft(elapsedTime);
					rotateCount = 0;
				}
			}
			if(spec.diff === 'easy'){
				//fire every n
				if(enemyFireCount >= 1500){
					gun.create();
					enemyFireCount = 0;
				}
				if(rotateCount >= 100){
					that.rotateLeft(elapsedTime);
					rotateCount = 0;
				}
			}
			wrap();
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

        that.getX = function(){
        	return spec.pos.x;
        };
        
        that.getScore = function(){
        	return spec.text;
        };
        
        that.getText = function(){
        	return spec.text;
        };
        
		that.updateScore20 = function(){
			//Update score text by 20 for Large Asteroid
			spec.text = spec.text + 20;
		};
		
		that.updateScore50 = function(){
			//Update score text by 50 for Medium Asteroid
			spec.text = spec.text + 50;
		};
		
		that.updateScore100 = function(){
			//Update score text by 100 for Small Asteroid
			spec.text = spec.text + 100;
		};
		
		that.updateScore200 = function(){
			//Update score text by 200 for Large Ship
			spec.text = spec.text + 200;
		};

		that.updateScore1000 = function(){
			//Update score text by 1000 for Small Ship
			spec.text = spec.text + 1000;
		};

		that.nextLevel = function(){
			spec.text = spec.text + 1;
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

        that.drawText = function() {
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
