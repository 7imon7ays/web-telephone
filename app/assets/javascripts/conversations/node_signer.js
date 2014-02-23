WebTelephone.NodeSigner = function ($signatureField, $errorOverlay) {
  this.$signatureField = $signatureField;
  this.$errorOverlay = $errorOverlay;
  this.errorHandler = new WebTelephone.ErrorHandler($errorOverlay);
};

WebTelephone.NodeSigner.prototype.listenForSignature = function () {
  var self = this;

  this.$signatureField.on("focus", function () {
    $(document).on("keyup", function (event) {
      if (event.which == 13) { self.submitSignature(event); }
    });
  });
};

WebTelephone.NodeSigner.prototype.submitSignature = function (event) {
  var $inputField = $(event.target)
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
