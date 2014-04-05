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
		shipExplosion1 = null,
		shipExplosion2 = null,
		shipExplosion3 = null,
		asteroidExplosion = null,
		missile = null,
		asteroid = null,
		asteroidsArray = [],
		count = 0,
		pause = 0,
		missileCount = 0,
		numAsteroids = 0,
		hyperCount = 0,
		shootAudio = null,
		ufoAudio = null,
		thrustAudio = null,
		explosionAudio = null,
		asteroidHit = false,
		cancelNextRequest = false,
		shipHit = false;
	
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
	
	var isSafe = function(x, y){
		var safeRadius = 200;
		var safeDistance = false;
		for(var i = 0; i < asteroidsArray.length; i++){
			var xDistance = x - asteroidsArray[i].getX();
			var yDistance = y - asteroidsArray[i].getY();
			safeDistance = (Math.sqrt((xDistance*xDistance) + (yDistance*yDistance)) >= (safeRadius+asteroidsArray[i].getRadius()));
		}
		
		return safeDistance;
	};
	
	var hyperJump = function(){
		if(ASTEROIDS.hyperReady){
			var x = Random.nextRange(0, ASTEROIDS.screenWidth); 
			var y = Random.nextRange(0, ASTEROIDS.screenHeight);
	
			if(isSafe(x, y)){
				ship.moveTo(x, y);
			}
			else if(!isSafe(x, y)){
				x = Random.nextRange(0, ASTEROIDS.screenWidth); 
				y = Random.nextRange(0, ASTEROIDS.screenHeight);
				hyperJump();
			}
			ASTEROIDS.hyperReady = false;
			hyperCount = 0;
		}
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
		
		numAsteroids = 3;
		ASTEROIDS.hyperReady = true;

		ship = ASTEROIDS.graphics.Texture( {
			image : ASTEROIDS.images['images/USU-Logo.png'],
			center : { x : ASTEROIDS.screenWidth/2, y : ASTEROIDS.screenHeight/2 },
			width : 70, height : 70,
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
			lifetime: 4,
			}, ASTEROIDS.graphics
		);
		

		leftThruster = particleSystem({
			image : ASTEROIDS.images['images/blueFire.png'],
			center: {x: ship.getLeftThrusterPos().x, y: ship.getLeftThrusterPos().y},
			size: {mean: 10, std: 4},
			speed: {mean: 10, stdev: 2},
			lifetime: {mean: 2, stdev: 1}
			}, ASTEROIDS.graphics
		);
		
		rightThruster = particleSystem({
			image : ASTEROIDS.images['images/blueFire.png'],
			center : {x: ship.getRightThrusterPos().x, y: ship.getRightThrusterPos().y},
			size: {mean: 10, std: 4},
			speed : {mean: 10, stdev: 2},
			lifetime: {mean: 2, stdev: 1}
			}, ASTEROIDS.graphics
		);

		shipExplosion1 = particleSystem({
			image : ASTEROIDS.images['images/fire.png'],
			center : {x: 0, y: 0},
			size: {mean: 30, std: 5},
			speed : {mean: 100, stdev: 10},
			lifetime: {mean: 2, stdev: 1}
			}, ASTEROIDS.graphics
		);
		
		shipExplosion2 = particleSystem({
			image : ASTEROIDS.images['images/smoke.png'],
			center : {x: 0, y: 0},
			size: {mean: 40, std: 5},
			speed : {mean: 60, stdev: 40},
			lifetime: {mean: 2, stdev: 1}
			}, ASTEROIDS.graphics
		);
		
		shipExplosion3 = particleSystem({
			image : ASTEROIDS.images['images/blueFire.png'],
			center : {x: 0, y: 0},
			size: {mean: 30, std: 5},
			speed : {mean: 20, stdev: 10},
			lifetime: {mean: 2, stdev: 1}
			}, ASTEROIDS.graphics
		);
		
		asteroidExplosion = particleSystem({
			image: ASTEROIDS.images['images/Asteroid2.png'],
			center: {x: 0, y: 0},
			size: {mean: 10, std: 5},
			speed: {mean: 200, stdev: 10},
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
		
		explosionAudio = audio({
			sound: 'sounds/depthCharge.wav',
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
					rotateRate : Random.nextRange(2, 6),	// Radians per second
					size : 3
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
		
		for(var i = 0; i < asteroidsArray.length; i++){
			asteroidsArray[i].asteroidMovement(i, elapsedTime);
		}
		
		//asteroidHit === true then this code does stuff to make explosion there
		asteroidHit = missile.findParticle(asteroidsArray);
		if(asteroidHit.hit){
			explosionAudio.play();
			var x = asteroidHit.x, 
				y = asteroidHit.y,
				size = asteroidHit.size;
			asteroidExplosion.updatePos(asteroidHit.x, asteroidHit.y);
			for(var i = 0; i < 10; i++)
				asteroidExplosion.create();
			asteroidHit = false;
//			console.log('Asteroid Hit!  ' + asteroidHit.x);
			//add new asteroids
			//size 3 asteroids split into 3 smaller ones
			if(size === 3){
				for(i = 0; i < 3; i++){
					asteroidsArray.push(ASTEROIDS.graphics.Texture( {
								image : ASTEROIDS.images['images/Asteroid2.png'],
								center : { x : x, y : y },
								width : 75, height : 75,
								rotation : 0,
								moveRate : Math.abs(Random.nextGaussian(75, 10)),			// pixels per second
								rotateRate : Random.nextRange(2, 6),	// Radians per second
								size : 2
							})
						);
					numAsteroids++;
				}
			}
			//size 2 asteroids split into 4 smaller ones
//this is commented out because on my little screen it just became unplayable too fast
			if(size === 2){
				for(i = 0; i < 4; i++){
					asteroidsArray.push(ASTEROIDS.graphics.Texture( {
								image : ASTEROIDS.images['images/Asteroid2.png'],
								center : { x : x, y : y },
								width : 30, height : 30,
								rotation : 0,
								moveRate : Math.abs(Random.nextGaussian(75, 10)),			// pixels per second
								rotateRate : Random.nextRange(2, 6),	// Radians per second
								size : 1
							})
						);
					numAsteroids++;
				}
			}
		}
		//end asteroid hit stuff
		
		//update the collisions between asteroid and ship
		for(var i = 0; i < asteroidsArray.length; i++){
			if(collisionDetected(ship, asteroidsArray[i])){
//				pause += elapsedTime;
				shipExplosion1.updatePos(ship.getX(), ship.getY());
				shipExplosion2.updatePos(ship.getX(), ship.getY());
				shipExplosion3.updatePos(ship.getX(), ship.getY());
				for(var i = 0; i < 200; i++){
					shipExplosion1.create();
					if(i%2 === 0){
						shipExplosion3.create();
						shipExplosion2.create();
					}
				}
				ship.shipHit();
				shipHit = true;
				//console.log(ship.getX() + '  ' + ship.getY());
			}
		}
		if(shipHit){
			pause += elapsedTime;
			//disappear for 1.5 seconds
			if(pause >= 1500){
				ship.reset(elapsedTime);
				pause = 0;
				shipHit = false;
			}
		}
		
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
		
		//update particle systems
		leftThruster.update(elapsedTime/1000);
		rightThruster.update(elapsedTime/1000);
		missile.update(elapsedTime/1000);
		shipExplosion1.update(elapsedTime/1000);
		shipExplosion2.update(elapsedTime/1000);
		shipExplosion3.update(elapsedTime/1000);
		asteroidExplosion.update(elapsedTime/1000);
	}
	
	//This is the main render function where various frameworks are rendered
	//
	function gameRender(elapsedTime){
		hyperCount += elapsedTime;
		if (hyperCount > 1000){
			ASTEROIDS.hyperReady = true;
		}
		ASTEROIDS.graphics.clear();
		
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
		
		//draw ship explosion particles and asteroid explosion
		shipExplosion1.render();
		shipExplosion2.render();
		shipExplosion3.render();
		asteroidExplosion.render();
		
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
		myKeyboard.registerCommand(ASTEROIDS.hyperSpace, hyperJump);
		
		cancelNextRequest = false;
		requestAnimationFrame(gameLoop);
	}
	
	return {
		initialize : initialize,
		run : run
	};
}());
