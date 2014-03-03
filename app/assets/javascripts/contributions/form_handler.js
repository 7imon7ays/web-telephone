WebTelephone.FormHandler = function ($canvasWrapper) {
  if ($canvasWrapper) {
    this.$canvasWrapper = $canvasWrapper;
    this.emptyCanvasValue = $canvasWrapper[0].toDataURL();
    this.submissionIsADrawing = true;
  }
  this.errorHandler = new WebTelephone.ErrorHandler($(".js-error-form"));
  this.$formField = $("input[name='contribution[blob]']");
  this.$serverForm = $("#server-form");
  this.$submitButton = $("#submit");
  this.keysPressed = {};
};

WebTelephone.FormHandler.prototype.listenForSubmission = function() {
  var boundedSubmissionHandler = this.handleSubmission.bind(this);

  this.listenForClick(boundedSubmissionHandler);
  this.listenForCmdEnter(boundedSubmissionHandler);

  $("form").on("submit", function (event) {
    event.preventDefault();
    boundedSubmissionHandler();
  });
};

WebTelephone.FormHandler.prototype.listenForClick = function (handleSubmission) {
  this.$submitButton.on("click touchend", function (event) {
    handleSubmission();
  });
};

WebTelephone.FormHandler.prototype.listenForCmdEnter = function (handleSubmission) {
  var self = this;

  $(window).on("keydown", function (event) {
    self.keysPressed[event.which] = true;
    if (event.which == 13 && self.keysPressed[91]) {
      handleSubmission();
    }
  });
  $(window).on("keyup", function (event) {
    delete self.keysPressed[event.which];
  });
};

WebTelephone.FormHandler.prototype.handleSubmission = function() {

  this.fillBlob();

  if (this.submissionIsADrawing) {
    if (this.drawingIsBad()) {
      this.errorHandler.flash("Don't leave it blank!");
    }
    else {
      this.submitContribution();
    }
  }
  else {
    if (this.sentenceIsBad()) {
      this.errorHandler.flash("Describe the picture in at least 2 words.");
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

WebTelephone.FormHandler.prototype.submitContribution = function () {
  var self = this
    , submissionData = this.$serverForm.serializeJSON();
  submissionData["contribution"]["empty_canvas_value"] = this.emptyCanvasValue;

  $.post("/contributions", submissionData)
  .done(function (data) {
    var previousSession =
      (window.sessionStorage.getItem("contributions") || "");
    window.sessionStorage.setItem(
      "contributions", previousSession + "," + data.id
    );

    location.href = location.origin + "/thank-you" +
      "?" + "thread_id=" + data.thread_id;
  })
  .fail(function (data) {
    self.errorHandler.flash(data.responseJSON[0]);
  });
};
