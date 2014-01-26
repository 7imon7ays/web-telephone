WebTelephone.PromptFetcher = function (promptURL, $promptEl) {
  this.promptURL = $("#prompt-url").html();;
  this.$promptEl = $("#prompt");
};

WebTelephone.PromptFetcher.prototype.fetchPrompt = function () {
  var self = this;
  $.get(this.promptURL, function (promptData){
    if (self.$promptEl.is("img")) {
     $promptEl.attr("src", promptData);
    } else {
      $promptEl.html(promptData);
    }
  });
};
