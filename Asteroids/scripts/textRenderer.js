/*jslint browser: true, white: true */
/*global CanvasRenderingContext2D, ASTEROIDS */
// ------------------------------------------------------------------
//
//
// ------------------------------------------------------------------

ASTEROIDS.textRenderer = (function() {
	'use strict';
	
	var canvas = document.getElementById('settingsCanvas'),
		context = canvas.getContext('2d');
	ASTEROIDS.screenWidth = canvas.width = window.innerWidth;
	ASTEROIDS.screenHeight = canvas.height = window.innerHeight;
	
	//
	// Place a 'clear' function on the Canvas prototype, this makes it a part
	// of the canvas, rather than making a function that calls and does it.
	CanvasRenderingContext2D.prototype.clear = function() {
		this.save();
		this.setTransform(1, 0, 0, 1, 0, 0);
		this.clearRect(0, 0, canvas.width, canvas.height);
		this.restore();
	};
	
	function clear() {
		context.clear();
	}
	
    //code for rendering text
    function Text(spec) {
        var that = {};

        that.updateRotation = function(angle) {
            spec.rotation += angle;
        };

        function measureTextHeight(spec) {
            context.save();

            context.font = spec.font;
            context.fillStyle = spec.fill;
            context.strokeStyle = spec.stroke;

            var height = context.measureText('C').width;

            context.restore();

            return height;
        }

        function measureTextWidth(spec) {
            context.save();

            context.font = spec.font;
            context.fillStyle = spec.fill;
            context.strokeStyle = spec.stroke;

            var width = context.measureText(spec.text).width;

            context.restore();

            return width;
        }

        that.draw = function() {
            context.save();

            context.font = spec.font;
            context.fillStyle = spec.fill;
            context.strokeStyle = spec.stroke;
            context.textBaseline = 'top';

            context.translate(spec.pos.x + that.width / 2, spec.pos.y + that.height / 2);
            context.rotate(spec.rotation);
            context.translate(-(spec.pos.x + that.width / 2), -(spec.pos.y + that.height / 2));

            context.fillText(spec.text, spec.pos.x, spec.pos.y);
            context.strokeText(spec.text, spec.pos.x, spec.pos.y);

            context.restore();
        };

        that.height = measureTextHeight(spec);
        that.width = measureTextWidth(spec);
        that.pos = spec.pos;

        return that;
    }


	return {
		clear : clear,
		Text : Text
	};
}());
