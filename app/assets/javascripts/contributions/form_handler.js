WebTelephone.FormHandler = function ($canvasWrapper) {
  if ($canvasWrapper) {
    this.$canvasWrapper = $canvasWrapper;
    this.emptyCanvasValue = $canvasWrapper[0].toDataURL();
    this.submissionIsADrawing = true;
  }
  this.$errorOverlay = $(".js-error-form");
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

  if (this.submissionIsADrawing) {
    if (this.drawingIsBad()) {
      this.flashBlankSubmissionError("Don't leave it blank!");
    }
    else {
      this.submitContribution();
    }
  }
  else {
    if (this.sentenceIsBad()) {
      this.flashBlankSubmissionError("Describe the picture in at least 2 words.");
    }
    else {
      this.submitContribution();
    }
  }
};

WebTelephone.FormHandler.prototype.fillBlob = function() {
  var submission;

  if (this.$canvasWrapper) {
    canvas = this.$canvasWrapper[0];
    submission = canvas.toDataURL('image/png');
  } else {
    submission = $("#sentence_field").val();
  }
  this.$formField.val(submission);
};

WebTelephone.FormHandler.prototype.sentenceIsBad = function () {
  if (this.$formField.val().split(' ').length <= 1  ) {
    return true;
  }
  return false;
};

WebTelephone.FormHandler.prototype.drawingIsBad = function () {
  if (this.$formField.val() === this.emptyCanvasValue) {
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
  var self = this
    , submissionData = this.$serverForm.serializeJSON();
  submissionData['contribution'].emptyCanvasValue = this.emptyCanvasValue;

  var jqhr = $.post("/contributions", submissionData)
  .done(function (data) {
    location.href = location.origin + "/thank-you" +
      "?" + "thread_id=" + data.thread_id;
  })
  .fail(function (data) {
    self.flashBlankSubmissionError(data.responseJSON[0]);
  });
};
