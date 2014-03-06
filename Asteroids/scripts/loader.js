//various parts of this code barrowed from Dean Mathias' class examples
var COINGAME = {
	images : {},

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
                                'preaload!scripts/graphics.js',
                                'preload!scripts/random.js',
                                'preload!scripts/coinDropSystem.js',
                                'preload!scripts/particleSystem.js',
                                'preload!scripts/textures.js',
                                'preload!scripts/countdown.js',
				'preload!scripts/input.js',
				'preload!scripts/open.js',
				'preload!images/Background.png',
                                'preload!images/Piggy-Bank.png',
                                'preload!images/Dollar-Sign.png',
                                'preload!images/Coin-US-Dollary.png',
                                'preload!images/Coin-Roman.png',
                                'preload!images/Coin-Canadian-Dollar.png',
                                'preload!images/Clock.png',
                                'preload!images/green-start-button.png',  //this image is from http://www.clker.com/clipart-another-green-start-button.html
                                'preload!images/credits_button.jpg',
                                'preload!scripts/coins.js',
                                'preload!scripts/levelOne.js',
                                'preload!scripts/levelTwo.js',
                                'preload!scripts/levelThree.js'
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
	
	COINGAME.status.preloadRequest += 1;
	var isImage = /.+\.(jpg|png|gif)$/i.test(resource.url);
	resource.noexec = isImage;
	resource.autoCallback = function(e) {
		if (isImage) {
			var image = new Image();
			image.src = resource.url;
			COINGAME.images[resource.url] = image;
		}
		COINGAME.status.preloadComplete += 1;
		
		//
		// When everything has finished preloading, go ahead and start the game
		if (COINGAME.status.preloadComplete === COINGAME.status.preloadRequest) {
			console.log('Preloading complete!');
			COINGAME.initialize();
		}
	};
	
	return resource;
});
