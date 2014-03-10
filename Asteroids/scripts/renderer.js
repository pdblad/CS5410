ASTEROIDS.graphics = (function() {
	'use strict';
	
	var canvas = document.getElementById('mainCanvas'),
		context = canvas.getContext('2d');
	
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
	
	function Texture(spec) {
		var that = {};
				
		that.rotateRight = function(elapsedTime) {
			spec.rotation += spec.rotateRate * (elapsedTime / 1000);
		};
		
		that.rotateLeft = function(elapsedTime) {
			spec.rotation -= spec.rotateRate * (elapsedTime / 1000);
		};
		
		that.moveLeft = function(elapsedTime) {
			spec.center.x -= spec.moveRate * (elapsedTime / 1000);
		};
		
		that.moveRight = function(elapsedTime) {
			spec.center.x += spec.moveRate * (elapsedTime / 1000);
		};
		
		that.moveUp = function(elapsedTime) {
			spec.center.y -= spec.moveRate * (elapsedTime / 1000);
		};
		
		that.moveDown = function(elapsedTime) {
			spec.center.y += spec.moveRate * (elapsedTime / 1000);
		};
		
		that.moveTo = function(center) {
			spec.center = center;
		};
		
		that.draw = function() {
			context.save();
			
			context.translate(spec.center.x, spec.center.y);
			context.rotate(spec.rotation);
			context.translate(-spec.center.x, -spec.center.y);
			
			context.drawImage(
				spec.image, 
				spec.center.x - spec.width/2, 
				spec.center.y - spec.height/2,
				spec.width, spec.height);
			
			context.restore();
		};
		
		return that;
	}
	

	function Text(spec) {
		var that = {};
		
		//------------------------------------------------------------------
		//
		// This returns the height of the specified font, in pixels.
		//
		//------------------------------------------------------------------
		function measureTextHeight(spec) {
			context.save();
			
			context.font = spec.font;
			context.fillStyle = spec.fill;
			context.strokeStyle = spec.stroke;
			
			var height = context.measureText('m').width;
			
			context.restore();
			
			return height;
		}
		
		//------------------------------------------------------------------
		//
		// This returns the width of the specified font, in pixels.
		//
		//------------------------------------------------------------------
		function measureTextWidth(spec) {
			context.save();
			
			context.font = spec.font;
			context.fillStyle = spec.fill;
			context.strokeStyle = spec.stroke;
			
			var width = context.measureText(spec.text).width;
			
			context.restore();
			
			return width;
		}

		that.textDraw = function() {
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

		//
		// Compute and expose some public properties for this text.
		that.height = measureTextHeight(spec);
		that.width = measureTextWidth(spec);
		that.pos = spec.pos;

		return that;
	}

	return {
		clear : clear,
		Texture : Texture,
		Text : Text
	};
}());
