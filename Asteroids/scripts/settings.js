			/*
			 * for each of the situations below display a different div with prompts for button selection
			 */
			//ask user which button they want to use for right
			//ASTEROIDS.navRight =
			
			//ask user which button they want to use for left
			//ASTEROIDS.navLeft = 
			
			//ask user which button they want to use for accelerate 
			//ASTEROIDS.navThrust = 
			
			//ask user which button they want to use for shoot
			//ASTEROIDS.shoot =

ASTEROIDS.screens['settings'] = (function() {
	'use strict';
	
	var cancelNextRequest = false,
		navRightTxt = null,
		navLeftTxt = null,
		navThrustTxt = null,
		shootTxt = null;
	
	function initialize() {
		document.getElementById('id-settings-back').addEventListener(
			'click',
			function() { 
				ASTEROIDS.game.showScreen('main-menu'); 
				cancelNextRequest = true;
				document.removeEventListener('keydown', onKeyDown, false);
			},
			false);
		
		navRightTxt = ASTEROIDS.graphics.Text({
            text: 'Press key to control the left rotation of ship',
            font: '90px Arial, sans-serif',
            fill: 'rgba(150, 0, 0, 1)',
            stroke: 'rgba(255, 0, 0, 1)',
            pos: {x: 450, y: 300},
            rotation: 0
        });
		
		navRightTxt.draw();
		
		navLeftTxt = 'left rotation';
		navThrustTxt = 'thrusters';
		shootTxt = '';
	}
	
	function onKeyDown(e){
        var keyPressed = String.fromCharCode(e.keyCode);
        console.log(keyPressed + ' : ' + e.keyCode);
	}
	
	function gameLoop(time){
		ASTEROIDS.elapsedTime = time - ASTEROIDS.lastTimeStamp;
		ASTEROIDS.lastTimeStamp = time;

		//update(ASTEROIDS.elapsedTime);
		//render(ASTEROIDS.elapsedTime);		

		if (!cancelNextRequest) {
			requestAnimationFrame(gameLoop);
		}
	}
	
	function run() {
		ASTEROIDS.lastTimeStamp = performance.now();
		//
		// Start the loop
		document.addEventListener('keydown', onKeyDown, false);
		cancelNextRequest = false;
		requestAnimationFrame(gameLoop);
	}
	
	return {
		initialize : initialize,
		run : run
	};
}());