WebTelephone.PromptFetcher = function (promptURL, $promptEl) {
  this.promptURL = $("#prompt-url").html();;
  this.$promptEl = $("#prompt");
};

WebTelephone.PromptFetcher.prototype.fetchPrompt = function () {
  var self = this;
  
  if (!this.promptURL) { return; }
  
  $.get(this.promptURL, function (data) {
    if (self.$promptEl.is("img")) {
      self.$promptEl.attr("src", data);
    } else {
      self.$promptEl.html(data);
    }
  });
};
