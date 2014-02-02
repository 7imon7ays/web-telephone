var WebTelephone = {};

jQuery(document).ready(function($) {
	// If submission page
	if ($("#js-init-submit").length) {
		// alert('submit');
		var $canvasWrapper = $("#canvas-wrapper");
		$canvasWrapper.length ? new WebTelephone.CanvasDrawer($canvasWrapper).init() : null;
	  	new WebTelephone.FormHandler($canvasWrapper).listenForSubmission();
	   	new WebTelephone.PromptFetcher().fetchPrompt();
	}
	// If thank-you page
	else if ($("#js-init-thankyou").length) {
	   	var thread = $.parseJSON($('#bootstrapped-thread-json').html());
	   	new WebTelephone.NodeLoad(thread).buildLinks();
	}
});
