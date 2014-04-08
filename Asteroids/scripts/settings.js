ASTEROIDS.screens['settings'] = (function() {
	'use strict';
	
	var cancelNextRequest = false,
		navRightTxt = null,
		navLeftTxt = null,
		navThrustTxt = null,
		shootTxt = null,
		hyperSpaceTxt = null,
		count = null,
		skip = false,
		used = [];
	
	function initialize() {
		//do this stuff when done with control options.
		/*document.getElementById('id-settings-back').addEventListener(
			'click',
			function() { 
				ASTEROIDS.game.showScreen('main-menu'); 
				cancelNextRequest = true;
				document.removeEventListener('keydown', onKeyDown, false);
			},
			false);*/
		count = 0;
		
		navRightTxt = ASTEROIDS.textRenderer.Text({
            text: 'Press a key for right rotation of ship',
            font: '80px Impact, fantasy',
            fill: 'rgba(255, 255, 255, 1)',
            stroke: 'rgba(255, 0, 0, 1)',
            pos: {x: 20, y: ASTEROIDS.screenHeight/2},
            rotation: 0
        });
		
		navLeftTxt = ASTEROIDS.textRenderer.Text({
			text: 'Press a key for left rotation of ship',
            font: '80px Impact, fantasy',
            fill: 'rgba(255, 255, 255, 1)',
            stroke: 'rgba(255, 0, 0, 1)',
            pos: {x: 20, y: ASTEROIDS.screenHeight/2},
            rotation: 0
		});
		
		navThrustTxt = ASTEROIDS.textRenderer.Text({
			text: 'Choose a key for thruster control',
            font: '80px Impact, fantasy',
            fill: 'rgba(255, 255, 255, 1)',
            stroke: 'rgba(255, 0, 0, 1)',
            pos: {x: 20, y: ASTEROIDS.screenHeight/2},
            rotation: 0
		});
		
		shootTxt = ASTEROIDS.textRenderer.Text({
			text: 'Choose a key for missle shooting',
            font: '80px Impact, fantasy',
            fill: 'rgba(255, 255, 255, 1)',
            stroke: 'rgba(255, 0, 0, 1)',
            pos: {x: 20, y: ASTEROIDS.screenHeight/2},
            rotation: 0
		});
		
		hyperSpaceTxt = ASTEROIDS.textRenderer.Text({
			text: 'Choose a key for hyperspace',
            font: '80px Impact, fantasy',
            fill: 'rgba(255, 255, 255, 1)',
            stroke: 'rgba(255, 0, 0, 1)',
            pos: {x: 20, y: ASTEROIDS.screenHeight/2},
            rotation: 0
		});
	}
	
	function onKeyDown(e){
        var keyPressed = String.fromCharCode(e.keyCode);
        console.log(keyPressed + ' : ' + e.keyCode);
        for(var key = 0; key < used.length; key++){
        	if(used[key] === e.keyCode)
        		skip = true;
        }
        
        if(count == 0 && !skip){
        	ASTEROIDS.navRight = e.keyCode;
        	used.push(e.keyCode);
        	count++;
        }
        else if(count == 1 && !skip){
        	ASTEROIDS.navLeft = e.keyCode;
        	used.push(e.keyCode);
        	count++;
        }
        else if(count == 2 && !skip){
        	ASTEROIDS.navThrust = e.keyCode;
        	used.push(e.keyCode);
        	count++;
        }
        else if(count == 3 && !skip){
        	ASTEROIDS.hyperSpace = e.keyCode;
        	used.push(e.keyCode);
        	count++;
        }
        else if(count == 4 && !skip){
        	ASTEROIDS.shoot = e.keyCode;
        	//then exit settings menu and cancel this screen
        	count = 0;
        	used = [];
        	ASTEROIDS.customControls = true;
        	ASTEROIDS.game.showScreen('main-menu'); 
			cancelNextRequest = true;
			document.removeEventListener('keydown', onKeyDown, false);
        }
        skip = false;
	}
	
	function update(elapsedTime){
		
	}
	
	function render(elapsedTime){
		ASTEROIDS.textRenderer.clear();
		if(count == 0)
			navRightTxt.draw();
		else if(count == 1)
			navLeftTxt.draw();
		else if(count == 2)
			navThrustTxt.draw();
		else if(count == 3)
			hyperSpaceTxt.draw();
		else
			shootTxt.draw();			
	}
	
	function gameLoop(time){
		ASTEROIDS.elapsedTime = time - ASTEROIDS.lastTimeStamp;
		ASTEROIDS.lastTimeStamp = time;

		update(ASTEROIDS.elapsedTime);
		render(ASTEROIDS.elapsedTime);	
		
		console.log('settings');

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