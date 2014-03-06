WebTelephone.NodeFlagger = function ($flagForm, $errorOverlay) {
  this.$flagForm = $flagForm;
  this.errorHandler = new WebTelephone.ErrorHandler($errorOverlay);
}

WebTelephone.NodeFlagger.prototype.flag = function () {
  var $flagButton = this.$flagForm.find("input[type='submit']")
    , contributionId = $flagButton.data("id")
    , flagData = { contribution_id: contributionId };

  $.post("/contributions/" + contributionId + "/flags", { flag: flagData })
  .done(function (contribution) {
    console.log(contribution);
  })
  .fail(function (error) {
    this.errorHandler.flash(error.responseJSON[0]);
  }.bind(this));
};

