ASTEROIDS.screens['game-play'] = (function() {
	'use strict';
	
	var mouseCapture = false,
		myMouse = ASTEROIDS.input.Mouse(),
		myKeyboard = ASTEROIDS.input.Keyboard(),
		pigTexture = null,
		UsCoin = null,
		romanCoin = null,
		canadaCoin = null,
		clock = null,
		levelText = null,
		startText = null,
		scoreText = null,
		cancelNextRequest = false,
		oneSecond = 0,
		count = 0,
		levelOneArray = [],
		levelTwoArray = [],
		levelThreeArray = [];

	function initialize() {
		console.log('game initializing...');
	}
	
	//------------------------------------------------------------------
	//
	// This is the Game Loop function
	//
	//------------------------------------------------------------------
	function gameLoop(time) {
		ASTEROIDS.elapsedTime = time - ASTEROIDS.lastTimeStamp;
		ASTEROIDS.lastTimeStamp = time;

		myKeyboard.update(ASTEROIDS.elapsedTime);
		myMouse.update(ASTEROIDS.elapsedTime);
		
		ASTEROIDS.graphics.clear();

		if (!cancelNextRequest) {
			requestAnimationFrame(gameLoop);
		}
	}
	
	function run() {
		ASTEROIDS.lastTimeStamp = performance.now();

		// Start the animation loop
		cancelNextRequest = false;
		requestAnimationFrame(gameLoop);
	}
	
	return {
		initialize : initialize,
		run : run
	};
}());
