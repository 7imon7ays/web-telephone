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
  this.fillS3Data();
  this.postToServerAndS3();
};

WebTelephone.FormHandler.prototype.fillS3Data = function() {
  var $formField = $("#s3-file");

  if (!!this.$canvasWrapper.length) {
    canvas = this.$canvasWrapper[0];
    var dataURL = canvas.toDataURL('image/png');
    $formField.val(dataURL);
  } else {
    var description = $("#sentence_field").val();
    $formField.val(description);
  }
};

WebTelephone.FormHandler.prototype.postToServerAndS3 = function() {
  var formInput = $("#server-form").serializeJSON();
  $.post("contributions", formInput);
  $("#s3-form").submit();
};