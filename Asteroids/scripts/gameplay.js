/*jslint browser: true, white: true, plusplus: true */
/*global ASTEROIDS, console, KeyEvent, requestAnimationFrame, performance */
ASTEROIDS.screens['game-play'] = (function() {
	'use strict';
	
	var mouseCapture = false,
		myMouse = ASTEROIDS.input.Mouse(),
		myKeyboard = ASTEROIDS.input.Keyboard(),
		ship = null,
		leftThruster = null,
		rightThruster = null,
		particlesMissile = null,

		missile = null,
		asteroid = null,
		asteroidsArray = [],
		count = 0,
		cancelNextRequest = false;
	
	var collisionDetected = function(object1, object2){
		var object1Radius = object1.getRadius() - 15;	//Subtracted 15 to make up for ship not being exactly circular
		var object2Radius = object2.getRadius();
		var object1x = object1.getX();
		var object1y = object1.getY();
		var object2x = object2.getX();
		var object2y = object2.getY();
		
		//Distances
		var distanceX =  object1x - object2x;
		var distanceY = object1y - object2y;
		
		var distance = Math.sqrt((distanceX * distanceX) + (distanceY * distanceY));
		
		return (distance <= (object1Radius + object2Radius));
	};
	
	function initialize() {
		console.log('game initializing...');
		//go fullscreen
		var canvas = document.getElementById('mainCanvas');
		canvas.requestFullScreen;

		ship = ASTEROIDS.graphics.Texture( {
			image : ASTEROIDS.images['images/USU-Logo.png'],
			center : { x : ASTEROIDS.screenWidth/2, y : ASTEROIDS.screenHeight/2 },
			width : 70, height : 70,
			rotation : -3.14,
			leftThrusterPos : {x : 0, y : 0},
			rightThrusterPos : {x : 0, y : 0},
			moveRate : 200,			// pixels per second
			rotateRate : 3.14159,	// Radians per second
			dx : 0,
			dy : 0
		});

		leftThruster = particleSystem({
			image : ASTEROIDS.images['images/fire.png'],
			center: {x: ship.rotation, y: ship.rotation},
			speed: {mean: 50, stdev: 25},
			lifetime: {mean: 4, stdev: 1}
		},
			ASTEROIDS.graphics
		);
		
		rightThruster = particleSystem({
			image : ASTEROIDS.images['images/fire.png'],
			center : {x: ship.getX()+40, y: ship.getY()-20},
			speed : {mean: 20, stdev: 5},
			lifetime: {mean: 4, stdev: 1}
		},
			ASTEROIDS.graphics
		);

		missile = ASTEROIDS.graphics.Texture( {
			image : ASTEROIDS.images['images/LaserBall.png'],
			center : { x : ship.getX(), y : ship.getY() },
			width : 25, height : 25,
			rotation : -3.14,
			speed : 500,
			dx : 0,
			dy : 0
		});
		
		for(var i = 0; i < 20; i++){
			asteroidsArray.push(
				asteroid = ASTEROIDS.graphics.Texture( {
					image : ASTEROIDS.images['images/Asteroid.png'],
					center : { x : Random.nextRange(50, ASTEROIDS.screenWidth), y : -100 },
					width : 100, height : 100,
					rotation : 0,
					moveRate : Math.abs(Random.nextGaussian(50, 10)),			// pixels per second
					rotateRate : 3.14159	// Radians per second
				})
			);
		}

		
		/*particlesFire = particleSystem( {
			image : ASTEROIDS.images['images/LaserShot.png'],
			center: {x: 300, y: 300},
			speed: {mean: 50, stdev: 25},
			lifetime: {mean: 4, stdev: 1}
			}, ASTEROIDS.graphics
		);*/


		//
		// Create the keyboard input handler and register the keyboard commands
		myKeyboard.registerCommand(KeyEvent.DOM_VK_A, ship.rotateLeft);
		myKeyboard.registerCommand(KeyEvent.DOM_VK_D, ship.rotateRight);
		myKeyboard.registerCommand(KeyEvent.DOM_VK_S, ship.fireThrusters);
		myKeyboard.registerCommand(KeyEvent.DOM_VK_SPACE, missile.shoot);
		myKeyboard.registerCommand(KeyEvent.DOM_VK_ESCAPE, function() {
			//
			// Stop the game loop by canceling the request for the next animation frame
			cancelNextRequest = true;
			//
			// Then, return to the main menu
			ASTEROIDS.game.showScreen('main-menu');
		});
		
		//
		// capture mouse events, not doing anything currently
		myMouse = ASTEROIDS.input.Mouse();
		myMouse.registerCommand('mousedown', function(e) {
			mouseCapture = true;
		});

		myMouse.registerCommand('mouseup', function() {
			mouseCapture = false;
		});

		myMouse.registerCommand('mousemove', function(e) {
			if (mouseCapture) {
			}
		});
	}
	
	//This is the main update function where various frameworks can be updated
	//
	function gameUpdate(elapsedTime){
		ASTEROIDS.graphics.clear();
		myKeyboard.update(elapsedTime);
		myMouse.update(elapsedTime);
		for(var i = 0; i < 5; i++){
			asteroidsArray[i].asteroidMovement(i, elapsedTime);
		}
		ship.updatePos();
//		rightThruster.updatePos(ship.getDx()*(-1), ship.getDy()*(-1));
//		rightThruster.update(elapsedTime/1000);
//		missile.updatePos();
	}
	
	//This is the main render function where various frameworks are rendered
	//
	function gameRender(elapsedTime){
		ship.draw();

		for(var i = 0; i < 20; i++){
			if(collisionDetected(ship, asteroidsArray[i])){
				ship.reset(elapsedTime);
			}
		}
		
		for(var i = 0; i < 5; i++){
			asteroidsArray[i].draw();
		}
//		rightThruster.render();
//		rightThruster.create();
//		rightThruster.create();
//		missile.draw();
	}
	
	//------------------------------------------------------------------
	//
	// This is the Game Loop function!
	//
	//------------------------------------------------------------------
	function gameLoop(time) {
		ASTEROIDS.elapsedTime = time - ASTEROIDS.lastTimeStamp;
		ASTEROIDS.lastTimeStamp = time;
		count++;

		gameUpdate(ASTEROIDS.elapsedTime);
		gameRender(ASTEROIDS.elapsedTime);		

		if (!cancelNextRequest) {
			requestAnimationFrame(gameLoop);
		}
	}
	
	function run() {
		ASTEROIDS.lastTimeStamp = performance.now();
		//
		// Start the animation loop
		cancelNextRequest = false;
		requestAnimationFrame(gameLoop);
	}
	
	return {
		initialize : initialize,
		run : run
	};
}());
