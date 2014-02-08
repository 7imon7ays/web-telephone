WebTelephone.FormHandler = function ($canvasWrapper) {
  if ($canvasWrapper) {
    this.$canvasWrapper = $canvasWrapper;
    this.emptyCanvasValue = $canvasWrapper[0].toDataURL();
  }
  this.$blankErrorOverlay = $(".blank-error-overlay");
  this.$formField = $("input[name='contribution[blob]']");
  this.$serverForm = $("#server-form");
};

WebTelephone.FormHandler.prototype.listenForSubmission = function() {
  var self = this;
  $("#submit").on("click", function (event) {
    self.handleSubmission();
  });
};

WebTelephone.FormHandler.prototype.handleSubmission = function() {

  this.fillBlob();
  if ( this.submissionIsBlank() ) {
    this.flashBlankSubmissionError();
  } else {
    this.submit();
  }
};

WebTelephone.FormHandler.prototype.fillBlob = function() {
  
  if (this.$canvasWrapper) {
    canvas = this.$canvasWrapper[0];
    var dataURL = canvas.toDataURL('image/png');
    this.$formField.val(dataURL);
  } else {
    var description = $("#sentence_field").val();
    this.$formField.val(description);
  }
};

WebTelephone.FormHandler.prototype.submissionIsBlank = function () {
  var submission = this.$formField.val();
  if (submission == "" || submission == this.emptyCanvasValue) {
    return true;
  }
  return false;
};

WebTelephone.FormHandler.prototype.flashBlankSubmissionError = function () {
  var $blankErrorOverlay = this.$blankErrorOverlay;
  $blankErrorOverlay.removeClass("hidden");
  setTimeout(function () {
    $blankErrorOverlay.addClass("hidden");
  }, 1500)
};

WebTelephone.FormHandler.prototype.submit = function () {
  this.$serverForm.submit();
};