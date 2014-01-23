var WebTelephone = {}

jQuery(document).ready(function($) {
	var $canvasWrapper = $("#canvas-wrapper");
	console.log($canvasWrapper);
	new WebTelephone.CanvasDrawer($canvasWrapper).init();
    new WebTelephone.FormHandler($canvasWrapper).listenForSubmission()
});

