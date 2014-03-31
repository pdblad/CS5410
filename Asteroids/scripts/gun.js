/* Modified particleSystem
 
/*jslint browser: true, white: true, plusplus: true */
/*global Random */
function gun(spec, graphics) {
    'use strict';
    var that = {},
            nextName = 1, // unique identifier for the next particle
            particles = {};	// Set of all active particles

    //------------------------------------------------------------------
    //
    // This creates one new particle
    //
    //------------------------------------------------------------------
    that.create = function() {
        var p = {
            image: spec.image,
            size: 25,
            center: {x: spec.center.x, y: spec.center.y},
            direction: {x: spec.direction.x, y: spec.direction.y},
            speed: spec.speed, // pixels per second
            rotation: 0,
            lifetime: spec.lifetime, // How long the particle should live, in seconds
            alive: 0, // How long the particle has been alive, in seconds
        };

        //
        // Ensure we have a valid size - gaussian numbers can be negative
        p.size = Math.max(1, p.size);
        //
        // Same thing with lifetime
        p.lifetime = Math.max(0.01, p.lifetime);
        //
        // Assign a unique name to each particle
        particles[nextName++] = p;
    };

    //move particle system to gun position
    that.updatePos = function(center, rotation) {
       spec.center.x = center.x;
       spec.center.y = center.y;
       spec.direction.x = Math.cos(rotation);
       spec.direction.y = Math.sin(rotation);
    };

	var wrap = function(particle){
		var xMax = ASTEROIDS.screenWidth, yMax = ASTEROIDS.screenHeight;
		// check x boundary
		if (particle.center.x > xMax) {
			particle.center.x -= xMax;
		} else if (particle.center.x < 0) {
			particle.center.x += xMax;
		}
		// check y bounds
		if (particle.center.y > yMax) {
			particle.center.y -= yMax;
		} else if (particle.center.y < 0) {
			particle.center.y += yMax;
		}
	};
	
    //------------------------------------------------------------------
    //
    // Update the state of all particles.  This includes remove any that 
    // have exceeded their lifetime.
    //
    //------------------------------------------------------------------
    that.update = function(elapsedTime) {
        var removeMe = [],
                value,
                particle;
        for (value in particles) {
            if (particles.hasOwnProperty(value)) {
                particle = particles[value];
                //
                // Update how long it has been alive
                particle.alive += elapsedTime;

                //
                // Update its position
                particle.center.x += (elapsedTime * particle.speed * particle.direction.x);
                particle.center.y += (elapsedTime * particle.speed * particle.direction.y);
                
                wrap(particle);

                //
                // Rotate proportional to its speed
                //particle.rotation += particle.speed / 300;

                //
                // If the lifetime has expired, identify it for removal
                if (particle.alive > particle.lifetime) {
                    removeMe.push(value);
                }
            }
        }

        //
        // Remove all of the expired particles
        for (particle = 0; particle < removeMe.length; particle++) {
            delete particles[removeMe[particle]];
        }
        removeMe.length = 0;
    };

    //finds if the mouse clicked event is over any of our objects
    //
    //adapt this to test if bullet should be removed early after asteroid collision
    /*
    that.findParticle = function(mouseX, mouseY) {
        var removeMe = [],
                value,
                particle;
        for (value in particles) {
            if (particles.hasOwnProperty(value)) {
                particle = particles[value];
                //
                // check if mousex and y are in the diameter of the particle
                if (COINGAME.inCircle(particle.center.x, particle.center.y, mouseX, mouseY, particle.size / 2)) {
                    removeMe.push(value);
                    //add particle.value to the score
                    if (particle.value === -1){
                        //canadian
                        COINGAME.totalScore.text = 0;
                        COINGAME.playBuzzer();
                    }
                    else if (particle.value === 0){
                        //clock, add more coins
                        COINGAME.addCoinsBool = true;
                        COINGAME.playLevelUp();
                    }
                    else{
                        COINGAME.totalScore.text += particle.value;
                        COINGAME.dollarParticleSpec.center.x = mouseX;
                        COINGAME.dollarParticleSpec.center.y = mouseY;
                        COINGAME.playCashSound();
                        COINGAME.hitCount++;
                    }
                }
            }
        }
        //remove all clicked on particles
        for (particle = 0; particle < removeMe.length; particle++) {
            delete particles[removeMe[particle]];
        }
        removeMe.length = 0;
    };
	*/

    //function that tells us if the particles{} object has anymore properties
    //
    that.noMoreParticles = function() {
        var count = 0,
                value;
        for (value in particles) {
            if (particles.hasOwnProperty(value)) {
                count++;
            }
        }
        if (count > 0)
            return false;
        else
            return true;
    };

    //------------------------------------------------------------------
    //
    // Render all particles
    //
    //------------------------------------------------------------------
    that.render = function() {
        var value,
                particle;

        for (value in particles) {
            if (particles.hasOwnProperty(value)) {
                particle = particles[value];
                graphics.drawImage(particle);
            }
        }
    };
    return that;
}