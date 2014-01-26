var WebTelephone = {}

jQuery(document).ready(function($) {
	var $canvasWrapper = $("#canvas-wrapper");
	$canvasWrapper.length ? new WebTelephone.CanvasDrawer($canvasWrapper).init() : null;
  new WebTelephone.FormHandler($canvasWrapper).listenForSubmission()
});

