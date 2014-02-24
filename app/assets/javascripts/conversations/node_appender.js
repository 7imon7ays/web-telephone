WebTelephone.NodeConstructor = function (contribution, playerSubmissionIds) {
  this.contribution = contribution;
  this.$blank_picture = $('#js-blank-picture');
  this.$blank_sentence = $('#js-blank-sentence');
  this.playerSubmissionIds = playerSubmissionIds;
};

WebTelephone.NodeConstructor.prototype.build = function() {
  var contribution = this.contribution
    , new_node
    , meta
    , more;

  // Build things specific to a sentence node
  if (contribution.category === "sentence") {
    new_node = this.$blank_sentence.clone();
    new_node.find('.saved-sentence').html(contribution.blob);
  // Build things specific to a picture node
  } else {
    new_node = this.$blank_picture.clone();
    new_node.find('.saved-picture').attr("src", contribution.blob);
  }

  // Build things common to any node
  new_node.attr("id", contribution.id);
  new_node.attr("data-rank", contribution.rank);
  new_node.find('.node-share').
  attr("href", "/?parent_id=" + contribution.id);
  new_node.find('.node-link')
  .attr("href", "/thank-you?thread_id=" +
    contribution.thread_id +
    "#" + contribution.id);
  meta = new_node.find('.node-meta');
  more = new_node.find('.node-meta-more');
  meta.find('.node-rank').html(contribution.rank);
  var location = contribution.author.location;
  meta.find('.node-region').html(location);
  var signatureField = more.find(".node-signature");
  var playerIsAuthor = this.playerSubmissionIds[contribution.id];
  if (contribution.signature && contribution.signature != "") {
    signatureField.html(contribution.signature);
  } else if (playerIsAuthor) {
    signatureField.html(this.signatureForm(contribution.id));
  }

  return new_node;
};

WebTelephone.NodeConstructor.prototype.signatureForm = function (id) {
  var formString = "" +
    "<span id='contribution-" +
    id +
    "-signature'>" +
    "<label for='contribution-" + id + "' " +
    "class='signature-label'>Sign it</label>" +
    "<input id='contribution-" + id + "' " +
    "data-id='" + id + "' " +
    "class='signature-input'>" +
    "</span>"

  return formString;
};
