/*jslint browser: true, white: true, plusplus: true */
/*global ASTEROIDS */
ASTEROIDS.screens['main-menu'] = (function() {
	'use strict';
	
	function initialize() {
		setTimeout(function(){ ASTEROIDS.game.showScreen('ai'); }, 10000);
		
		// Setup each of menu events for the screens
		document.getElementById('id-new-game').addEventListener(
			'click',
			function() { ASTEROIDS.game.showScreen('game-play'); },
			false);
		
		document.getElementById('id-settings').addEventListener(
				'click',
				function() {ASTEROIDS.game.showScreen('settings');},
				false);
		
		document.getElementById('id-high-scores').addEventListener(
			'click',
			function() { ASTEROIDS.game.showScreen('high-scores'); },
			false);
		
		document.getElementById('id-help').addEventListener(
			'click',
			function() { ASTEROIDS.game.showScreen('help'); },
			false);
		
		document.getElementById('id-credits').addEventListener(
			'click',
			function() { ASTEROIDS.game.showScreen('credits'); },
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
