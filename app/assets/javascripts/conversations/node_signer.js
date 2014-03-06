WebTelephone.NodeSigner = function ($signatureField, $errorOverlay) {
  this.$signatureField = $signatureField;
  this.$errorOverlay = $errorOverlay;
  this.errorHandler = new WebTelephone.ErrorHandler($errorOverlay);
};

WebTelephone.NodeSigner.prototype.submitSignature = function () {
  var $field = this.$signatureField
    , contributionID = $field.data("id")
    , signature = $field.val()
    , signatureData = { contribution: {
        signature: signature
      }
  };

  if (signature == "") {
    this.errorHandler.flash("Don't sign it blank!!");
    return;
  }

  $.ajax({
    url: "contributions/" + contributionID,
    type: "PUT",
    data: signatureData
  }).done(function(contribution) {
    this.sign(contribution);
  }.bind(this))
  .fail(function (error) {
    this.errorHandler.flash(error.responseJSON[0]);
  }.bind(this));
};

WebTelephone.NodeSigner.prototype.sign = function (contribution) {
  var $contributionSpan = $("#contribution-" + contribution.id + "-signature" );

  $contributionSpan.html(contribution.signature);
};

