WebTelephone.FormHandler = function ($canvasWrapper) {
  this.$canvasWrapper = $canvasWrapper;
};

WebTelephone.FormHandler.prototype.listenForSubmission = function() {
  var self = this;
  $("#submit").on("click", function (event) {
    self.handleSubmission();
  });
};

WebTelephone.FormHandler.prototype.handleSubmission = function() {
  var $formField = $("input[name='contribution[blob]']")
    , $serverForm = $("#server-form");

  this.fillBlob($formField);
  this.submitIfValid($formField, function () {
    $serverForm.submit();
  });
};

WebTelephone.FormHandler.prototype.fillBlob = function($formField) {
  
  if (!!this.$canvasWrapper.length) {
    canvas = this.$canvasWrapper[0];
    var dataURL = canvas.toDataURL('image/png');
    $formField.val(dataURL);
  } else {
    var description = $("#sentence_field").val();
    $formField.val(description);
  }
};

WebTelephone.FormHandler.prototype.submitIfValid = function ($formField, callback) {
  // Currently only validates sentences.
  if ($formField.val() == "") {
    console.log("Gotta come up with something.")
  } else {
    callback();
  }
};
