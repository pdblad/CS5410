ASTEROIDS.screens['gameover'] = (function() {
	'use strict';
	
	function initialize() {
		document.getElementById('id-gameover-back').addEventListener(
			'click',
			function() { location.reload(); },
			false);
	}
	
	function run() {
		//
		// I know this is empty, there isn't anything to do.
	}
	
	return {
		initialize : initialize,
		run : run
	};
}());
