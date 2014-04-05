function audio(spec) {
	var that = {};
	
	//create new audio sound
	that.play = function(){
		var sound = {
				sound: spec.sound,
				duration: spec.duration,
				volume: spec.volume  //needs to be a number between 0 and 1
			},
			thisSound = new Audio(spec.sound);
		thisSound.volume = spec.volume;
		thisSound.play();
	};
	
	return that;	
}