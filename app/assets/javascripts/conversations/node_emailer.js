WebTelephone.NodeEmailer = function ($emailForm, $errorOverlay) {
  this.$emailForm = $emailForm;
  this.$errorOverlay = $errorOverlay;
  this.errorHandler = new WebTelephone.ErrorHandler($errorOverlay);
};

WebTelephone.NodeEmailer.prototype.email = function () {
  var contributionId = this.$emailForm.data("id")
    , address = this.$emailForm
        .find("input[type='email']").val()
    , submissionData = { emailer: {
        contribution_id: contributionId,
        address: address
      }}
    , url = "/contributions/" + contributionId + "/emailers";

  $.post(url, submissionData)
  .done(function (data) {
    this.$emailForm.replaceWith(JST["_email_confirmation"]());
  }.bind(this))
  .fail(function (error) {
    this.errorHandler.flash(error.responseJSON[0]);
  }.bind(this));
};
