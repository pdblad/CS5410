/*jslint browser: true, white: true, plusplus: true */
/*global ASTEROIDS */
ASTEROIDS.screens['main-menu'] = (function() {
	'use strict';
	
	function initialize() {
		var active = false;
		setTimeout(function(){ 
			if(!active){
				ASTEROIDS.game.showScreen('ai');
			}
		}, 10000);
		
		// Setup each of menu events for the screens
		document.getElementById('id-new-game').addEventListener(
			'click',
			function() { 
				ASTEROIDS.game.showScreen('game-play');
				active = true;
			},
			false);
		
		document.getElementById('id-settings').addEventListener(
				'click',
				function() {
					ASTEROIDS.game.showScreen('settings');
					active = true;
				},
				false);
		
		document.getElementById('id-high-scores').addEventListener(
			'click',
			function() { 
				ASTEROIDS.game.showScreen('high-scores');
				active = true;
			},
			false);
		
		document.getElementById('id-help').addEventListener(
			'click',
			function() { 
				ASTEROIDS.game.showScreen('help');
				active = true;
			},
			false);
		
		document.getElementById('id-credits').addEventListener(
			'click',
			function() { 
				ASTEROIDS.game.showScreen('credits');
				active = true;
			},
			false);
	}
	
	function run() {
		//start AI after 10 seconds

	}
	
	return {
		initialize : initialize,
		run : run
	};
}());
