function audio(spec) {
	var that = {};
	
	//create new audio sound
	that.play = function(){
		var sound = {
				sound: spec.sound,
				duration: spec.duration
			},
			thisSound = new Audio(spec.sound);
		thisSound.play();
	};
	
	return that;	
}