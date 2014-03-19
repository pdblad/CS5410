/*jslint browser: true, white: true, plusplus: true */
/*global ASTEROIDS, console, KeyEvent, requestAnimationFrame, performance */
ASTEROIDS.screens['game-play'] = (function() {
	'use strict';
	
	var mouseCapture = false,
		myMouse = ASTEROIDS.input.Mouse(),
		myKeyboard = ASTEROIDS.input.Keyboard(),
		myTexture = null,
		particlesMissile = null,
		cancelNextRequest = false;
	
	function initialize() {
		console.log('game initializing...');

		myTexture = ASTEROIDS.graphics.Texture( {
			image : ASTEROIDS.images['images/USU-Logo.png'],
			center : { x : 500, y : 500 },
			width : 100, height : 100,
			rotation : 0,
			moveRate : 200,			// pixels per second
			rotateRate : 3.14159,	// Radians per second
			dx : 0,
			dy : 0
		});
		
		particlesFire = particleSystem( {
			image : ASTEROIDS.images['images/LaserShot.png'],
			center: {x: 300, y: 300},
			speed: {mean: 50, stdev: 25},
			lifetime: {mean: 4, stdev: 1}
			}, ASTEROIDS.graphics
		);


		//
		// Create the keyboard input handler and register the keyboard commands
		myKeyboard.registerCommand(KeyEvent.DOM_VK_A, myTexture.moveLeft);
		myKeyboard.registerCommand(KeyEvent.DOM_VK_D, myTexture.moveRight);
		myKeyboard.registerCommand(KeyEvent.DOM_VK_W, myTexture.moveUp);
		myKeyboard.registerCommand(KeyEvent.DOM_VK_S, myTexture.moveDown);
		myKeyboard.registerCommand(KeyEvent.DOM_VK_Q, myTexture.rotateLeft);
		myKeyboard.registerCommand(KeyEvent.DOM_VK_E, myTexture.rotateRight);
		myKeyboard.registerCommand(KeyEvent.DOM_VK_SPACE, myTexture.moveForward);
		myKeyboard.registerCommand(KeyEvent.DOM_VK_ESCAPE, function() {
			//
			// Stop the game loop by canceling the request for the next animation frame
			cancelNextRequest = true;
			//
			// Then, return to the main menu
			ASTEROIDS.game.showScreen('main-menu');
		});
		
		//
		// Create an ability to move the logo using the mouse
		myMouse = ASTEROIDS.input.Mouse();
		myMouse.registerCommand('mousedown', function(e) {
			mouseCapture = true;
			myTexture.moveTo({x : e.clientX, y : e.clientY});
		});

		myMouse.registerCommand('mouseup', function() {
			mouseCapture = false;
		});

		myMouse.registerCommand('mousemove', function(e) {
			if (mouseCapture) {
				myTexture.moveTo({x : e.clientX, y : e.clientY});
			}
		});
	}
	
	//------------------------------------------------------------------
	//
	// This is the Game Loop function!
	//
	//------------------------------------------------------------------
	function gameLoop(time) {
		ASTEROIDS.elapsedTime = time - ASTEROIDS.lastTimeStamp;
		ASTEROIDS.lastTimeStamp = time;

		myKeyboard.update(ASTEROIDS.elapsedTime);
		myMouse.update(ASTEROIDS.elapsedTime);

		ASTEROIDS.graphics.clear();
		myTexture.draw();

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
