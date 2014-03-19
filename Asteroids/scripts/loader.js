//various parts of this code borrowed from Dean Mathias' class examples
var ASTEROIDS = {
	images : {},
	screens : {},

	status : {
		preloadRequest : 0,
		preloadComplete : 0
	}
};

//------------------------------------------------------------------
//
// Wait until the browser 'onload' is called before starting to load
// any external resources.  This is needed because a lot of JS code
// will want to refer to the HTML document.
//
//------------------------------------------------------------------
window.addEventListener('load', function() {
	console.log('Loading resources...');
	Modernizr.load([
		{
			load : [
			        'preload!scripts/renderer.js',
                    'preload!scripts/input.js',
			        'preload!scripts/mainmenu.js',
			        'preload!scripts/game.js',
                    'preload!scripts/screens.js',
			        'preload!scripts/credits.js',
			        'preload!scripts/gameplay.js',
			        'preload!scripts/help.js',
			        'preload!scripts/highscores.js',
                    'preload!scripts/credits.js',
			        'preload!scripts/random.js',
                    'preload!images/Background.png',
                    'preload!images/USU-Logo.png'
			],
			complete : function() {
				console.log('All files requested for loading...');
			}
		}
	]);
}, false);

//Code taken from Dean Mathias' class examples
// Extend yepnope with our own 'preload' prefix that...
// * Tracks how many have been requested to load
// * Tracks how many have been loaded
// * Places images into the 'images' object
yepnope.addPrefix('preload', function(resource) {
	console.log('preloading: ' + resource.url);
	
	ASTEROIDS.status.preloadRequest += 1;
	var isImage = /.+\.(jpg|png|gif)$/i.test(resource.url);
	resource.noexec = isImage;
	resource.autoCallback = function(e) {
		if (isImage) {
			var image = new Image();
			image.src = resource.url;
			ASTEROIDS.images[resource.url] = image;
		}
		ASTEROIDS.status.preloadComplete += 1;
		
		//
		// When everything has finished preloading, go ahead and start the game
		if (ASTEROIDS.status.preloadComplete === ASTEROIDS.status.preloadRequest) {
			console.log('Preloading complete!');
			ASTEROIDS.game.initialize();
		}
	};
	
	return resource;
});