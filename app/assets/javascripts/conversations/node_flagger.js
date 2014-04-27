WebTelephone.NodeFlagger = function ($flagForm, $errorOverlay) {
  this.$flagForm = $flagForm;
  this.errorHandler = new WebTelephone.ErrorHandler($errorOverlay);
  this.$holder = $flagForm.parents('.holder-main');
};

WebTelephone.NodeFlagger.prototype.flag = function () {
  var $flagButton = this.$flagForm.find("input[type='submit']")
    , contributionId = $flagButton.data("contribution-id")
    , flagData = { contribution_id: contributionId };

  $.post("/contributions/" + contributionId + "/flags", { flag: flagData })
  .done(function (flag) {
    var unflagForm = JST["_node_unflag"]({
      nodeId: contributionId,
      flagId: flag.id
    });
    this.$flagForm.parent().replaceWith(unflagForm);
    this.$holder.addClass('flagged');
  }.bind(this))
  .fail(function (error) {
    this.errorHandler.flash(error.responseJSON[0]);
  }.bind(this));
};

WebTelephone.NodeFlagger.prototype.unflag = function () {
  var $unflagButton = this.$flagForm.find("input[type='submit']")
    , contributionId = $unflagButton.data("contribution-id")
    , flagId = $unflagButton.data("flag-id");

  $.ajax({
    type: "DELETE",
    url: "/contributions/" + contributionId + "/flags/" + flagId
  })
  .done(function (contributionId) {
    var flagForm = JST["_node_flag"]({
      nodeId: contributionId,
      nodeFlag: null
    });
    this.$flagForm.parent().replaceWith(flagForm);
    this.$holder.removeClass('flagged');
  }.bind(this))
  .fail(function (error) {
    this.errorHandler.flash(error.responseJSON[0]);
  }.bind(this));
};

