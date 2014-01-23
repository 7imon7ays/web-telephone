var WebTelephone = {}

jQuery(document).ready(function($) {
	var $canvasWrapper = $("#canvas-wrapper");
	new WebTelephone.CanvasDrawer($canvasWrapper).init();
    new WebTelephone.FormHandler($canvasWrapper).listenForSubmission()
});

