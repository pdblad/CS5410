/*jslint browser: true, white: true, plusplus: true */
/*global ASTEROIDS, console, KeyEvent, requestAnimationFrame, performance */
ASTEROIDS.screens['game-play'] = (function() {
	'use strict';
	
	var myKeyboard = ASTEROIDS.input.Keyboard(),
		ship = null,
		enemyShipEasy = null,
		enemyShipHard = null,
		leftThruster = null,
		rightThruster = null,
		shipExplosion = null,
		asteroidExplosion = null,
		missile = null,
		asteroid = null,
		asteroidsArray = [],
		count = 0,
		pause = 0,
		missileCount = 0,
		numAsteroids = 0,
		shootAudio = null,
		ufoAudio = null,
		thrustAudio = null,
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
	
	var fireMissile = function(){
		missile.updatePos({x: ship.getGunPos().x, y: ship.getGunPos().y}, 
						//{x: ship.getGunAngle().x, y: ship.getGunAngle().y},
						ship.getRotation()
			);
		missileCount++;
		if(missileCount === 8){
			shootAudio.play();
			missile.create();
			missileCount = 0;
		}
	};
	
	function initialize() {
		console.log('game initializing...');
		
		numAsteroids = 10;

		ship = ASTEROIDS.graphics.Texture( {
			image : ASTEROIDS.images['images/USU-Logo.png'],
			center : { x : ASTEROIDS.screenWidth/2, y : ASTEROIDS.screenHeight/2 },
			width : 80, height : 80,
			rotation : -3.14,
			moveRate : 200,			// pixels per second
			rotateRate : 3.14159,	// Radians per second
			dx : 0,
			dy : 0,
			fireThrusters : false
		});
		
		enemyShipEasy = ASTEROIDS.graphics.Texture({
			image : ASTEROIDS.images['images/BYU-Logo.png'],
			center : {x : Random.nextRange(50, ASTEROIDS.screenWidth), y : Random.nextRange(50, ASTEROIDS.screenHeight)},
			width : 80, height : 80,
			rotation : -3.14,
			moveRate : 200,
			rotateRate : 3.14159,
			dx : 0,
			dy : 0,
			fireThrusters : false
		});
		
		enemyShipHard = ASTEROIDS.graphics.Texture({
			image : ASTEROIDS.images['images/UofU-Logo.png'],
			center : {x : Random.nextRange(50, ASTEROIDS.screenWidth), y : Random.nextRange(50, ASTEROIDS.screenHeight)},
			width : 80, height : 80,
			rotation : -3.14,
			moveRate : 200,
			rotateRate : 3.14159,
			dx : 0,
			dy : 0,
			fireThrusters : false
		});
		
		missile = gun({
			image: ASTEROIDS.images['images/LaserBall.png'],
			center: {x: ship.getGunPos().x, y: ship.getGunPos().y},
			direction: {x: 0, y: 0},
			speed: 350,
			lifetime: 5,
			}, ASTEROIDS.graphics
		);
		

		leftThruster = particleSystem({
			image : ASTEROIDS.images['images/fire.png'],
			center: {x: ship.getLeftThrusterPos().x, y: ship.getLeftThrusterPos().y},
			speed: {mean: 10, stdev: 2},
			lifetime: {mean: 2, stdev: 1}
			}, ASTEROIDS.graphics
		);
		
		rightThruster = particleSystem({
			image : ASTEROIDS.images['images/fire.png'],
			center : {x: ship.getRightThrusterPos().x, y: ship.getRightThrusterPos().y},
			speed : {mean: 10, stdev: 2},
			lifetime: {mean: 2, stdev: 1}
			}, ASTEROIDS.graphics
		);

		shipExplosion = particleSystem({
			image : ASTEROIDS.images['images/fire.png'],
			center : {x: ship.getX(), y: ship.getY()},
			speed : {mean: 10, stdev: 2},
			lifetime: {mean: 2, stdev: 1}
			}, ASTEROIDS.graphics
		);
		
		shootAudio = audio({
			sound: 'sounds/asteroids_shoot.wav',
			duration: 0
		});
		
		ufoAudio = audio({
			sound: 'sounds/asteroids_saucer.wav',
			duration: 0
		});
		
		thrustAudio = audio({
			sound: 'sounds/asteroids_thrust.wav',
			duration: 0
		});
		
		for(var i = 0; i < numAsteroids; i++){
			asteroidsArray.push(
				asteroid = ASTEROIDS.graphics.Texture( {
					image : ASTEROIDS.images['images/Asteroid2.png'],
					center : { x : Random.nextRange(50, ASTEROIDS.screenWidth), y : ASTEROIDS.screenHeight },
					width : 125, height : 125,
					rotation : 0,
					moveRate : Math.abs(Random.nextGaussian(75, 10)),			// pixels per second
					rotateRate : Random.nextRange(2, 6)	// Radians per second
				})
			);
		}

		//
		// Create the keyboard input handler and register the keyboard commands
		myKeyboard.registerCommand(KeyEvent.DOM_VK_ESCAPE, function() {
			//
			// Stop the game loop by canceling the request for the next animation frame
			cancelNextRequest = true;
			//
			// Then, return to the main menu
			ASTEROIDS.game.showScreen('main-menu');
		});
	}
	
	//This is the main update function where various frameworks can be updated
	//
	function gameUpdate(elapsedTime){
		ASTEROIDS.graphics.clear();
		myKeyboard.update(elapsedTime);
		myMouse.update(elapsedTime);
		
		for(var i = 0; i < asteroidsArray.length; i++){
			asteroidsArray[i].asteroidMovement(i, elapsedTime);
		}
		missile.findParticle(asteroidsArray);
		
		//update all 3 ships
		enemyShipEasy.updateEnemy('easy', elapsedTime);
		enemyShipHard.updateEnemy('hard', elapsedTime);
		ship.updatePos();

		//only update thruster specs if the thruster button is hit
		if(ship.getThrusterStatus()){
			leftThruster.updatePos(ship.getLeftThrusterPos().x, ship.getLeftThrusterPos().y);
			rightThruster.updatePos(ship.getRightThrusterPos().x, ship.getRightThrusterPos().y);
			for(var i = 0; i < 10; i++){
				leftThruster.create();
				rightThruster.create();
			}
			thrustAudio.play();
			ship.setThrusterStatus(false);
		}
		
		leftThruster.update(elapsedTime/1000);
		rightThruster.update(elapsedTime/1000);
		missile.update(elapsedTime/1000);
	}
	
	//This is the main render function where various frameworks are rendered
	//
	function gameRender(elapsedTime){
		ASTEROIDS.graphics.clear();
		for(var i = 0; i < asteroidsArray.length; i++){
			if(collisionDetected(ship, asteroidsArray[i])){
				pause += elapsedTime;
				ship.explosion(elapsedTime);
				//Explode for 1.5 seconds
				if(pause >= 1500){
					ship.reset(elapsedTime);
					pause = 0;
				}
			}
		}
		
		for(var i = 0; i < asteroidsArray.length; i++){
			asteroidsArray[i].draw();
		}
		
		leftThruster.render();
		rightThruster.render();
		
		//draw all bullet particles
		missile.render();
		
		//draw enemy ships
		enemyShipEasy.draw();
		enemyShipHard.draw();
		
		//draw ship last to make exaust go behind it
		ship.draw();
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
		if(!ASTEROIDS.customControls){
			ASTEROIDS.navRight = KeyEvent.DOM_VK_L;
			ASTEROIDS.navLeft = KeyEvent.DOM_VK_J;
			ASTEROIDS.navThrust = KeyEvent.DOM_VK_K;
			ASTEROIDS.shoot = KeyEvent.DOM_VK_Z;
			ASTEROIDS.hyperSpace = KeyEvent.DOM_VK_H;
		}
		myKeyboard.registerCommand(ASTEROIDS.navLeft, ship.rotateLeft);
		myKeyboard.registerCommand(ASTEROIDS.navRight, ship.rotateRight);
		myKeyboard.registerCommand(ASTEROIDS.navThrust, ship.fireThrusters);
		myKeyboard.registerCommand(ASTEROIDS.shoot, fireMissile);
		myKeyboard.registerCommand(ASTEROIDS.hyperSpace, null); //ship.hyperSpace to come
		
		cancelNextRequest = false;
		requestAnimationFrame(gameLoop);
	}
	
	return {
		initialize : initialize,
		run : run
	};
}());
