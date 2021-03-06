/*jslint browser: true, white: true, plusplus: true */
/*global ASTEROIDS, console, KeyEvent, requestAnimationFrame, performance */
ASTEROIDS.screens['ai'] = (function() {
	'use strict';
	
	var myKeyboard = ASTEROIDS.input.Keyboard(),
		ship = null,
		enemyShipEasy = null,
		enemyShipHard = null,
		missile = null,
		enemyGunEasy = null,
		enemyGunHard = null,
		leftThruster = null,
		rightThruster = null,
		shipExplosion1 = null,
		shipExplosion2 = null,
		shipExplosion3 = null,
		asteroidExplosion = null,
		hyperExplode = null,
		asteroid = null,
		asteroidsArray = [],
		lifeArray = [],
		enemyArray = [],
		enemyGunArray = [],
		count = 0,
		pause = 0,
		missileCount = 0,
		numAsteroids = 0,
		hyperCount = 0,
		invincibleCount = 0,
		gameTimer = 0,
		newLife = 10000,
		currLevelScore = 0,
		shootAudio = null,
		ufoAudio = null,
		thrustAudio = null,
		explosionAudio = null,
		shipExplodeAudio = null,
		hyperAudio = null,
		scoreText = null,
		levelText = null,
		levelNumText = null,
		lives = null,
		asteroidHit = false,
		cancelNextRequest = false,
		shipHit = false,
		shipInvincible = false,
		ufoHit = false,
		easyAdded = false,
		hardAdded = false,
		fireCount = 0;
	
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
		var safeRadius = 300;
		var safeDistance = false;
		for(var i = 0; i < asteroidsArray.length; i++){
			var xDistance = x - asteroidsArray[i].getX();
			var yDistance = y - asteroidsArray[i].getY();
			safeDistance = (Math.sqrt((xDistance*xDistance) + (yDistance*yDistance)) > (safeRadius+asteroidsArray[i].getRadius()));
		}
		
		return safeDistance;
	};
	
	var fireMissile = function(){
		missile.updatePos({x: ship.getGunPos().x, y: ship.getGunPos().y}, 
						ship.getRotation()
			);
		missileCount++;
		if(missileCount === 8){
			shootAudio.play();
			missile.create();
			missileCount = 0;
		}
	};

	var hyperJump = function(){
		if(ASTEROIDS.hyperReady){
			hyperExplode.updatePos(ship.getX(), ship.getY());
			hyperAudio.play();
			for(var i = 0; i < 100; i++){
				hyperExplode.create();
			}
			
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
	
	
	var explodeShip = function(){				
		shipExplodeAudio.play();
//		lifeArray.pop(); //Comment out for AI, so that it will go on living forever
		if(lifeArray.length == 0){
			//Game Over and Restart Game
			ASTEROIDS.game.showScreen('gameover');
			cancelNextRequest = true;
		}
		
		shipExplosion1.updatePos(ship.getX(), ship.getY());
		shipExplosion2.updatePos(ship.getX(), ship.getY());
		shipExplosion3.updatePos(ship.getX(), ship.getY());
		for(var i = 0; i < 200; i++){
			shipExplosion1.create();
			if(i%2 === 0){
				shipExplosion3.create();
				shipExplosion2.create();
			}
			ship.shipHit();
			shipHit = true;
			shipInvincible = true;
		}
	};
	
	function initialize() {
		console.log('game initializing...');
		
		numAsteroids = 3;
		ASTEROIDS.hyperReady = true;

		ship = ASTEROIDS.aiGraphics.Texture( {
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
		
		enemyShipEasy = ASTEROIDS.aiGraphics.Texture({
			diff : 'easy',
			image : ASTEROIDS.images['images/BYU-Logo.png'],
			center : {x : Random.nextRange(50, ASTEROIDS.screenWidth), y : Random.nextRange(50, ASTEROIDS.screenHeight)},
			width : 80, height : 80,
			rotation : -3.14,
			moveRate : 100,
			rotateRate : 3.14159,
			dx : 0,
			dy : 0,
			speed : 2,
			direction : Random.nextCircleVector()
		});
		
		enemyShipHard = ASTEROIDS.aiGraphics.Texture({
			diff : 'hard',
			image : ASTEROIDS.images['images/UofU-Logo.png'],
			center : {x : Random.nextRange(50, ASTEROIDS.screenWidth), y : Random.nextRange(50, ASTEROIDS.screenHeight)},
			width : 80, height : 80,
			rotation : -3.14,
			moveRate : 100,
			rotateRate : 3.14159,
			dx : 3,
			dy : 3,
			speed : 3,
			direction : Random.nextCircleVector()
		});
		
		missile = gun({
			image: ASTEROIDS.images['images/LaserBall.png'],
			center: {x: ship.getGunPos().x, y: ship.getGunPos().y},
			size: 25,
			direction: {x: 0, y: 0},
			speed: 400,
			lifetime: 4,
			}, ASTEROIDS.aiGraphics
		);
		
		enemyGunEasy = gun({
			image: ASTEROIDS.images['images/enemyBullet.png'],
			center: {x: enemyShipEasy.getGunPos().x, y: enemyShipEasy.getGunPos().y},
			size: 25,
			direction: {x: 0, y: 0},
			speed: 200,
			lifetime: 6,
			}, ASTEROIDS.aiGraphics
		);
		
		enemyGunHard = gun({
			image: ASTEROIDS.images['images/enemyBullet.png'],
			center: {x: enemyShipHard.getGunPos().x, y: enemyShipHard.getGunPos().y},
			size: 25,
			direction: {x: 0, y: 0},
			speed: 300,
			lifetime: 3,
			}, ASTEROIDS.aiGraphics
		);
		
		leftThruster = particleSystem({
			image : ASTEROIDS.images['images/blueFire.png'],
			center: {x: ship.getLeftThrusterPos().x, y: ship.getLeftThrusterPos().y},
			size: {mean: 20, std: 4},
			speed: {mean: 10, stdev: 2},
			lifetime: {mean: 2, stdev: 1}
			}, ASTEROIDS.aiGraphics
		);
		
		rightThruster = particleSystem({
			image : ASTEROIDS.images['images/blueFire.png'],
			center : {x: ship.getRightThrusterPos().x, y: ship.getRightThrusterPos().y},
			size: {mean: 20, std: 4},
			speed : {mean: 10, stdev: 2},
			lifetime: {mean: 2, stdev: 1}
			}, ASTEROIDS.aiGraphics
		);
		
		hyperExplode = particleSystem({
			image : ASTEROIDS.images['images/star.png'],
			center : {x: 0, y: 0},
			size: {mean: 5, std: 4},
			speed : {mean: 300, stdev: 10},
			lifetime: {mean: 2, stdev: 1}
			}, ASTEROIDS.aiGraphics
		);

		shipExplosion1 = particleSystem({
			image : ASTEROIDS.images['images/fire.png'],
			center : {x: 0, y: 0},
			size: {mean: 30, std: 5},
			speed : {mean: 300, stdev: 10},
			lifetime: {mean: 2, stdev: 1}
			}, ASTEROIDS.aiGraphics
		);
		
		shipExplosion2 = particleSystem({
			image : ASTEROIDS.images['images/smoke.png'],
			center : {x: 0, y: 0},
			size: {mean: 40, std: 5},
			speed : {mean: 60, stdev: 40},
			lifetime: {mean: 2, stdev: 1}
			}, ASTEROIDS.aiGraphics
		);
		
		shipExplosion3 = particleSystem({
			image : ASTEROIDS.images['images/blueFire.png'],
			center : {x: 0, y: 0},
			size: {mean: 30, std: 5},
			speed : {mean: 100, stdev: 10},
			lifetime: {mean: 2, stdev: 1}
			}, ASTEROIDS.aiGraphics
		);
		
		asteroidExplosion = particleSystem({
			image: ASTEROIDS.images['images/Asteroid2.png'],
			center: {x: 0, y: 0},
			size: {mean: 5, std: 1},
			speed: {mean: 200, stdev: 10},
			lifetime: {mean: 2, stdev: 1}
			}, ASTEROIDS.aiGraphics
		);
		
		shootAudio = audio({
			sound: 'sounds/asteroids_shoot.wav',
			duration: 0,
			volume: .5
		});
		
		ufoAudio = audio({
			sound: 'sounds/asteroids_saucer.wav',
			duration: 0,
			volume: .5
		});
		
		thrustAudio = audio({
			sound: 'sounds/asteroids_thrust.wav',
			duration: 0,
			volume: .9
		});
		
		explosionAudio = audio({
			sound: 'sounds/depthCharge.wav',
			duration: 0,
			volume: .8
		});
		
		shipExplodeAudio = audio({
			sound: 'sounds/ship_explode.wav',
			duration: 0,
			volume: .7
		});
		
		hyperAudio = audio({
			sound: 'sounds/hyperJump.wav',
			duration: 0,
			volume: .5
		});
				
		scoreText = ASTEROIDS.aiGraphics.Text({
			text: 0,
            font: '50px Arial, sans-serif',
            fill: 'rgba(0, 0, 225, 0.5)',
            stroke: 'rgba(255, 255, 255, 1)',
            pos: {x: 20, y: 20},
            rotation: 0
		});
		
		levelText = ASTEROIDS.aiGraphics.Text({
			text: "Level",
            font: '50px Arial, sans-serif',
            fill: 'rgba(0, 0, 225, 0.5)',
            stroke: 'rgba(255, 255, 255, 1)',
            pos: {x: 200, y: 20},
            rotation: 0
		});
		
		levelNumText = ASTEROIDS.aiGraphics.Text({
			text: 1,
            font: '50px Arial, sans-serif',
            fill: 'rgba(0, 0, 225, 0.5)',
            stroke: 'rgba(255, 255, 255, 1)',
            pos: {x: 330, y: 20},
            rotation: 0
		});
		
		for(var i = 0; i < 3; i++){
			lifeArray.push(
				lives = ASTEROIDS.aiGraphics.Texture( {
					image : ASTEROIDS.images['images/USU-Logo.png'],
					center : { x : 450 + (i*75), y : 45 },
					width : 50, height : 50
				})
			);
		}
		
		for(var i = 0; i < numAsteroids; i++){
			asteroidsArray.push(
				asteroid = ASTEROIDS.aiGraphics.Texture( {
					image : ASTEROIDS.images['images/Asteroid2.png'],
					center : { x : Random.nextRange(50, ASTEROIDS.screenWidth), y : ASTEROIDS.screenHeight },
					width : 125, height : 125,
					rotation : 0,
					moveRate : Math.abs(Random.nextGaussian(50, 10)),			// pixels per second
					rotateRate : Random.nextRange(2, 6),	// Radians per second
					size : 3,
					direction : Random.nextRange(1,5)
				})
			);
		}

		//
		// Create the keyboard input handler and register the keyboard commands
//		document.addEventListener('keydown', function() {
//			//
//			// Stop the game loop by canceling the request for the next animation frame
//			cancelNextRequest = true;
//			//
//			// Then, return to the main menu
//			location.reload(); }, false);
		
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
		ASTEROIDS.aiGraphics.clear();

		myKeyboard.update(elapsedTime);
		
		if(scoreText.getScore() >= newLife){
			lifeArray.push(
					lives = ASTEROIDS.aiGraphics.Texture( {
						image : ASTEROIDS.images['images/USU-Logo.png'],
						center : { x : 450 + (lifeArray.length*75), y : 45 },
						width : 50, height : 50
					})
				);

			newLife+=10000;
		}
		
		//Start new level if all current asteroids (and UFO's) are destroyed
		if(asteroidsArray.length == 0){
			levelNumText.nextLevel();
			currLevelScore = 0;
			easyAdded = false;
			numAsteroids++;
			for(var i = 0; i < numAsteroids; i++){
				asteroidsArray.push(
					asteroid = ASTEROIDS.aiGraphics.Texture( {
						image : ASTEROIDS.images['images/Asteroid2.png'],
						center : { x : Random.nextRange(50, ASTEROIDS.screenWidth), y : ASTEROIDS.screenHeight },
						width : 125, height : 125,
						rotation : 0,
						moveRate : Math.abs(Random.nextGaussian(50, 10)),			// pixels per second
						rotateRate : Random.nextRange(2, 6),	// Radians per second
						size : 3,
						direction : Random.nextRange(1,5)
					})
				);
			}
		}
		
		for(var i = 0; i < asteroidsArray.length; i++){
			asteroidsArray[i].asteroidMovement(elapsedTime);
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
			
			//add new asteroids
			//size 3 asteroids split into 3 smaller ones
			if(size === 3){
				scoreText.updateScore20();
				currLevelScore += 20;
				for(i = 0; i < 3; i++){
					asteroidsArray.push(ASTEROIDS.aiGraphics.Texture( {
								image : ASTEROIDS.images['images/Asteroid2.png'],
								center : { x : x, y : y },
								width : 75, height : 75,
								rotation : 0,
								moveRate : Math.abs(Random.nextGaussian(50, 10)),			// pixels per second
								rotateRate : Random.nextRange(2, 6),	// Radians per second
								size : 2,
								direction : Random.nextRange(1,5)
							})
						);
				}
			}
			//size 2 asteroids split into 4 smaller ones
			if(size === 2){
				scoreText.updateScore50();
				currLevelScore += 50;
				for(i = 0; i < 4; i++){
					asteroidsArray.push(ASTEROIDS.aiGraphics.Texture( {
								image : ASTEROIDS.images['images/Asteroid2.png'],
								center : { x : x, y : y },
								width : 30, height : 30,
								rotation : 0,
								moveRate : Math.abs(Random.nextGaussian(50, 10)),			// pixels per second
								rotateRate : Random.nextRange(2, 6),	// Radians per second
								size : 1,
								direction : Random.nextRange(1,5)
							})
						);
				}
			}
			//add score for smaller size
			if(size === 1){
				scoreText.updateScore100();
				currLevelScore += 100;
			}
		}
		//end asteroid hit stuff
		
		
		ufoHit = missile.ufoHit(enemyArray, enemyGunArray);
		if(ufoHit.hit){
			if(ufoHit.type == 'hard'){
				scoreText.updateScore1000();
			}
			else if(ufoHit.type == 'easy'){
				scoreText.updateScore200();
			}

			explosionAudio.play();
			var x = ufoHit.x, 
				y = ufoHit.y;
			asteroidExplosion.updatePos(ufoHit.x, ufoHit.y);
			for(var i = 0; i < 10; i++)
				asteroidExplosion.create();
			ufoHit = false;
		}		
		
		//update the collisions between asteroid and ship
		//we should definitely look at putting all of these for loops in functions...
		if(!shipHit){
			for(var i = 0; i < asteroidsArray.length; i++){
				if(collisionDetected(ship, asteroidsArray[i]))
					explodeShip();
				if(enemyGunEasy.motherShipHit(ship).shipHit || enemyGunHard.motherShipHit(ship).shipHit)
					explodeShip();
			}
		}
		else{
			pause += elapsedTime;
			invincibleCount += elapsedTime;
			//disappear for 1.5 seconds
			if(pause >= 1000 && shipInvincible){
				ship.reset(elapsedTime);
				shipInvincible = false;
			}
			if(invincibleCount >= 4000){
				invincibleCount = pause = 0;
				shipHit = false;
			}
		}
		
		//only update thruster specs if the thruster button is hit
		if(ship.getThrusterStatus()){
			leftThruster.updatePos(ship.getLeftThrusterPos().x, ship.getLeftThrusterPos().y);
			rightThruster.updatePos(ship.getRightThrusterPos().x, ship.getRightThrusterPos().y);
			for(var i = 0; i < 2; i++){
				leftThruster.create();
				rightThruster.create();
			}
			thrustAudio.play();
			ship.setThrusterStatus(false);
		}
		
		//update all 3 ships
		ship.updateAI(elapsedTime);
		fireMissile();

//		fireCount += elapsedTime;
//		
//		//fire n000 seconds
//		if(fireCount >= 1000){
//			fireMissile();
//
//			fireCount = 0;
//		}

		if(enemyGunArray.length > 0){
			enemyShipEasy.updateEnemy(enemyShipEasy, enemyGunEasy, elapsedTime);
			enemyShipHard.updateEnemy(enemyShipHard, enemyGunHard, elapsedTime);
		}
		
		//update particle systems
		leftThruster.update(elapsedTime/1000);
		rightThruster.update(elapsedTime/1000);
		missile.update(elapsedTime/1000);
		enemyGunEasy.update(elapsedTime/1000);
		enemyGunHard.update(elapsedTime/1000);
		shipExplosion1.update(elapsedTime/1000);
		shipExplosion2.update(elapsedTime/1000);
		shipExplosion3.update(elapsedTime/1000);
		asteroidExplosion.update(elapsedTime/1000);
		hyperExplode.update(elapsedTime/1000);
		
		if(currLevelScore >= 1000 && !easyAdded){
			ufoAudio.play();
			enemyArray.push(enemyShipEasy);
			enemyGunArray.push(enemyGunEasy);
			easyAdded = true;
		}
		
		if(scoreText.getScore() >= 20000 && !hardAdded){
			ufoAudio.play();
			enemyArray.push(enemyShipHard);
			enemyGunArray.push(enemyGunHard);
			hardAdded = true;
		}
	}
	
	//This is the main render function where various frameworks are rendered
	//
	function gameRender(elapsedTime){
		hyperCount += elapsedTime;
		if (hyperCount > 1000){
			ASTEROIDS.hyperReady = true;
		}
		ASTEROIDS.aiGraphics.clear();
		
		for(var i = 0; i < asteroidsArray.length; i++){
			asteroidsArray[i].draw();
		}
				
		leftThruster.render();
		rightThruster.render();
		
		//draw all bullet particles
		missile.render();
		enemyGunEasy.render();
		enemyGunHard.render();
		
		//draw ship explosion particles and asteroid explosion
		shipExplosion1.render();
		shipExplosion2.render();
		shipExplosion3.render();
		asteroidExplosion.render();
		hyperExplode.render();
		
		//draw enemy ships
		for(var i = 0; i < enemyArray.length; i++){
			enemyArray[i].draw();
		}
		
		//draw ship last to make exaust go behind it
		ship.draw();
		
		//scoring text
		scoreText.drawText();
		levelText.drawText();
		levelNumText.drawText();
		for(var i = 0; i < lifeArray.length; i++){
			lifeArray[i].draw();
		}
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
