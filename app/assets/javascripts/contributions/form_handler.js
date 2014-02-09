WebTelephone.FormHandler = function ($canvasWrapper) {
  if ($canvasWrapper) {
    this.$canvasWrapper = $canvasWrapper;
    this.emptyCanvasValue = $canvasWrapper[0].toDataURL();
  }
  this.$errorOverlay = $(".error-overlay");
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
    this.flashBlankSubmissionError("Don't leave it blank!");
  } else {
    this.submitContribution();
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

WebTelephone.FormHandler.prototype.flashBlankSubmissionError = function (errorMsg) {
  var $errorOverlay = this.$errorOverlay
    , $errorMessageTag = $errorOverlay.find(".error-message")
    , errorMessage = errorMsg || "Error!";
  $errorMessageTag.html(errorMessage);
  $errorOverlay.removeClass("hidden");
  setTimeout(function () {
    $errorOverlay.addClass("hidden");
  }, 1500)
};

WebTelephone.FormHandler.prototype.submitContribution = function () {
  var self = this;
  var submissionData = this.$serverForm.serializeJSON();
  submissionData['contribution'].emptyCanvasValue = this.emptyCanvasValue;
  var jqhr = $.post("/contributions", submissionData)
  .done(function (data) {
    location.href = location.origin + "/thank-you" +
      "?" + "thread_id=" + data.thread_id;
  })
  .fail(function (response) {
    self.flashBlankSubmissionError(response);
  })
};
