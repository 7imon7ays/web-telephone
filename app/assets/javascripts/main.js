var WebTelephone = {};

WebTelephone.runSubmissionsPage = function () {
  var $canvasWrapper;

	$canvasWrapper = $("#canvas-wrapper");
  if ($canvasWrapper.length) {
    this.canvasDrawer = new WebTelephone.CanvasDrawer($canvasWrapper);
    this.canvasDrawer.init();
    this.formHandler = new this.FormHandler($canvasWrapper);
  } else {
    this.formHandler = new this.FormHandler();
  }

	this.formHandler.listenForSubmission();
};

WebTelephone.runThankYouPage = function () {
 	var thread = $.parseJSON($('#bootstrapped-thread-json').html());
  var flagMap = $.parseJSON($('#bootstrapped-flags-json').html());
  new WebTelephone.NodeLoad(thread, flagMap)
    .buildNodesFromThread(thread.contributions)
    .listenForUserInputs()
    .lazyLoader()
    .moreToggle()
    .clipboardCopier();
};

WebTelephone.initAboutOverlay = function() {
  $('.js-about-show').on('click touchend', function() {
    $('.js-about').removeClass('hidden');
  });

  // When a hide button of any overlay is clicked.
  $('.overlay').on('click touchend', $('.js-overlay-close'), function() {
    $(this).addClass('hidden');
  })
}

jQuery(document).ready(function($) {
	// If submission page
  if ($("#js-init-submit").length) { WebTelephone.runSubmissionsPage(); }
	// If thank-you page
	else if ($("#js-init-thankyou").length) { WebTelephone.runThankYouPage(); }

  WebTelephone.initAboutOverlay();

});
