WebTelephone.ErrorHandler = function ($errorOverlay) {
  this.$errorOverlay = $errorOverlay;
}

WebTelephone.ErrorHandler.prototype.flash = function (errorMsg) {
  var $errorOverlay = this.$errorOverlay
    , $errorMessageTag = $errorOverlay.find(".js-error-message")
    , errorMessage = errorMsg || "Error!";
  $errorMessageTag.html(errorMessage);
  $errorOverlay.removeClass("hidden");
  setTimeout(function () {
    $errorOverlay.addClass("hidden");
    $errorMessageTag.empty();
  }, 1500)
}