var NEW = {

	config: {
		canvas: {
			max_size: 500
		},

		drawingOptions: {
			weight: [2 , 6, 12],
			color: [
				"ff199c" // red
				,"ff9e00" // orange
				,"b7f300" // green
				,"529eff" // blue
				,"272727" // black
			]
		}
	},

	init: function() {
		this.scribbleInit();
		this.setCanvasSize();
		// this.scribbleSetDefaults();
		// this.scribbleAddListeners();
	},

	scribble : {},
	scribbleFidel : {},

	setCanvasSize: function() {

		// Get document dimensions
		var $doc = $(document);
		var h = $doc.height();
		var w = $doc.width();
		var max = this.config.canvas.max_size;

		// Set canvas size
		$canvas = $("#canvas-wrapper, .scribble-shadow-canvas");
		$canvas_holder = $('.scribble-canvas-holder');
		// If height is less than width, set dimensions to in respect to height
		// If both h and w are larger than max-size, set to max-size
		if ( h < w ) {
			console.log('1');
			$canvas.attr('height', (h-40));
		} else if ( h > max && w > max ) {
			console.log('2');
			$canvas.attr('height', max);
		} else {
			console.log('3');
			$canvas.attr('height', (w-40));
		}
		$canvas.attr('width', $canvas.attr('height'));
		$canvas_holder.height($canvas.attr('height')).width($canvas.attr('width'));
	},

	scribbleInit: function() {
		$canvas_wrapper = $("#canvas-wrapper");
		scribble = $canvas_wrapper.scribble(),
		scribbleFidel = $canvas_wrapper.data('scribble');
	},

	currentOptions: {
		weight: 6,
		color: "529eff"
	},

	updateCurrentOptions: function( new_options ) {
		for (var key in new_options) {
			this.currentOptions[key] = new_options[key];
		}
	},

	scribbleSetDefaults: function() {
		this.scribbleFidel.changeColor(this.currentOptions.color);
		this.scribbleFidel.changeSize(this.currentOptions.weight);
	},

	scribbleAddListeners: function() {
		$('.draw-weight').on('click touchend',function(e){
			e.preventDefault();
			scribbleFidel.changeSize(draw.nextOption('weight'));
		});
		$('.draw-color').on('click touchend',function(e){
			e.preventDefault();
			scribbleFidel.changeColor(draw.nextOption('color'));
		});
		$('.draw-undo').on('click touchend',function(e){
			e.preventDefault();
			scribbleFidel.undo();
		});
		$('.draw-redo').on('click touchend',function(e){
			e.preventDefault();
			scribbleFidel.redo();
		});
		$('.draw-reset').on('click touchend',function(e){
			e.preventDefault();
			scribbleFidel.clear();
		});
	},

	nextOption : function( option_type ) {
		var option_array = this.config.drawingOptions[option_type];
		var old_index = option_array.indexOf(this.currentOptions[option_type]);
		var new_value;

		// If we reach end of array, start back at beginning
		if ((old_index + 1) < option_array.length) {
			new_value = option_array[(old_index + 1)];
		}
		else {
			new_value = option_array[0];
		}

		// Update model
		var obj = {};
		obj[option_type] = new_value;
		this.updateCurrentOptions(obj);

		return new_value;
	}
}

jQuery(document).ready(function($) {

	NEW.init();

});