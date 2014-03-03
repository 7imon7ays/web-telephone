WebTelephone.NodeSigner = function ($signatureForm, $errorOverlay) {
  this.$signatureForm = $signatureForm;
  this.$errorOverlay = $errorOverlay;
  this.errorHandler = new WebTelephone.ErrorHandler($errorOverlay);
};

WebTelephone.NodeSigner.prototype.listenForSignature = function () {
  var self = this;

  this.$signatureForm.on("submit", function (event) {
    event.preventDefault();
    console.log(event);
    self.submitSignature(event);
  });
};

WebTelephone.NodeSigner.prototype.submitSignature = function (event) {
  var $inputField = $(event.target[0])
    , contributionID = $inputField.data("id")
    , signatureData = { contribution: {
      signature: $inputField.val()
    }
  };

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
