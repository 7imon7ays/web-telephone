// Methods for creating a new drawing
WebTelephone.CanvasDrawer = function ($canvasWrapper) {
  this.$canvasWrapper = $canvasWrapper;
  this.config = {
    canvas: { max_size: 500 },
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
  };
  this.currentOptions = { weight: 6, color: "529eff" },
  this.scribbleFidel = {};
};

WebTelephone.CanvasDrawer.prototype.init = function() {
  this.scribbleInit();
	this.setCanvasSize();
	this.scribbleSetDefaults();
	this.scribbleAddListeners();
};


WebTelephone.CanvasDrawer.prototype.setCanvasSize = function() {
	// Get document dimensions
	var $doc = $(document);
	var h = $doc.height();
	var w = $doc.width();
	var max = this.config.canvas.max_size;
  
	// Set canvas size
	$canvas = $("#canvas-wrapper, .scribble-shadow-canvas");
	$canvas_holder = $('.scribble-canvas-holder');
	$wrapper = $('.wrapper');
	// If height is less than width, set dimensions to in respect to height
	// If both h and w are larger than max-size, set to max-size
	if ( h > max && w > max ) {
		$canvas.attr('height', (max-40));
	}
	else if ( h < w ) {
		$canvas.attr('height', (h-40));
	} else {
		$canvas.attr('height', (w-40));
	}
	$canvas.attr('width', $canvas.attr('height'));
	$canvas_holder.height($canvas.attr('height')).width($canvas.attr('width'));
	$wrapper.width($canvas.attr('height'));
};

WebTelephone.CanvasDrawer.prototype.scribbleInit = function() {
	this.$canvasWrapper.scribble();
	this.scribbleFidel = this.$canvasWrapper.data('scribble');
};


WebTelephone.CanvasDrawer.prototype.updateCurrentOptions = function( new_options ) {
	for (var key in new_options) {
		this.currentOptions[key] = new_options[key];
	}
};

WebTelephone.CanvasDrawer.prototype.scribbleSetDefaults = function() {
	$('.draw-weight')
    .removeClass("light medium heavy")
    .addClass(this.assignWeightClass(this.currentOptions.weight));
	$('.draw-color').css({ 'background-color':('#'+this.currentOptions.color) });
	this.scribbleFidel.changeColor(this.currentOptions.color);
	this.scribbleFidel.changeSize(this.currentOptions.weight);
};

WebTelephone.CanvasDrawer.prototype.assignWeightClass = function( number ) {
	switch (number) {
		case (2) :
			return "light"
		break
		case (6) :
			return "medium"
		break
		case (12) :
			return "heavy"
		break
	}
};

WebTelephone.CanvasDrawer.prototype.scribbleAddListeners = function() {
  var self = this;
	$('.draw-weight').on('click touchend', function(e){
		e.preventDefault();
		var weight = self.nextOption('weight');
		self.scribbleFidel.changeSize(weight);
		var class_name = self.assignWeightClass(weight);
		$(this).removeClass("light medium heavy").addClass(class_name);
	});

	$('.draw-color').on('click touchend', function(e){
		e.preventDefault();
		var color = self.nextOption('color')
		self.scribbleFidel.changeColor(color);
		$(this).css( {'background-color':('#'+color) });
	});

	$('.draw-undo').on('click touchend', function(e){
		e.preventDefault();
		self.scribbleFidel.undo();
	});

	$('.draw-redo').on('click touchend', function(e){
		e.preventDefault();
		self.scribbleFidel.redo();
	});

	$('.draw-reset').on('click touchend', function(e){
		e.preventDefault();
		self.scribbleFidel.clear();
	});
};

WebTelephone.CanvasDrawer.prototype.nextOption = function( option_type ) {
	var option_array = this.config.drawingOptions[option_type];
	var old_index = option_array.indexOf(this.currentOptions[option_type]);

  old_index = (old_index + 1) % option_array.length;
  new_value = option_array[old_index];
  
	// Update model
	var obj = {};
	obj[option_type] = new_value;
	this.updateCurrentOptions(obj);

	return new_value;
};

