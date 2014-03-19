/*jslint browser: true, white: true, plusplus: true */
/*global ASTEROIDS, console, KeyEvent, requestAnimationFrame, performance */
ASTEROIDS.screens['game-play'] = (function() {
	'use strict';
	
	var mouseCapture = false,
		myMouse = ASTEROIDS.input.Mouse(),
		myKeyboard = ASTEROIDS.input.Keyboard(),
		myTexture = null,
		cancelNextRequest = false;
	
	function initialize() {
		console.log('game initializing...');

		myTexture = ASTEROIDS.graphics.Texture( {
			image : ASTEROIDS.images['images/USU-Logo.png'],
			center : { x : 100, y : 100 },
			width : 100, height : 100,
			rotation : 0,
			moveRate : 200,			// pixels per second
			rotateRate : 3.14159,	// Radians per second
			dx : 0,
			dy : 0
		});

		//
		// Create the keyboard input handler and register the keyboard commands
		myKeyboard.registerCommand(KeyEvent.DOM_VK_A, myTexture.rotateLeft);
		myKeyboard.registerCommand(KeyEvent.DOM_VK_D, myTexture.rotateRight);
		myKeyboard.registerCommand(KeyEvent.DOM_VK_S, myTexture.moveForward);
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
		myKeyboard.update(elapsedTime);
		myMouse.update(elapsedTime);
	}
	
	//This is the main render function where various frameworks are rendered
	//
	function gameRender(elapsedTime){
		ASTEROIDS.graphics.clear();
		myTexture.draw();
	}
	
	//------------------------------------------------------------------
	//
	// This is the Game Loop function!
	//
	//------------------------------------------------------------------
	function gameLoop(time) {
		ASTEROIDS.elapsedTime = time - ASTEROIDS.lastTimeStamp;
		ASTEROIDS.lastTimeStamp = time;

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
