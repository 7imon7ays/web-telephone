WebTelephone.NodeConstructor = function (contribution, playerSubmissionIds, flagMap) {
  this.flagMap = flagMap;
  this.contribution = contribution;
  this.$blank_picture = $('#js-blank-picture');
  this.$blank_sentence = $('#js-blank-sentence');
  this.playerSubmissionIds = playerSubmissionIds;
  this.months = [ "January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December" ];
};

WebTelephone.NodeConstructor.prototype.build = function() {
  var contribution = this.contribution
    , new_node
    , meta;
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

  // Hidden stuff
  new_node.attr("id", contribution.id);
  new_node.attr("data-rank", contribution.rank);
  new_node.find('.node-link')
  .attr("href", "/thank-you?thread_id=" +
    contribution.thread_id +
    "#" + contribution.id);

  // Node share link
  new_node.find('.node-share').
  attr("href", "/?parent_id=" + contribution.id);

  // Rank
  meta = new_node.find('.node-meta');
  meta.find('.node-rank').html(contribution.rank);

  // Location
  var location = contribution.author.location;
  meta.find('.node-region').html(location);

  // Date
  var date = new Date(contribution.created_at);
  meta.find('.node-date').html(this.months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear());

  // Signature
  var signatureField = meta.find(".node-signature");
  var playerIsAuthor = this.playerSubmissionIds[contribution.id];
  if (contribution.signature && contribution.signature != "") {
    signatureField.html("by: " + contribution.signature);
  } else if (playerIsAuthor) {
    signatureField.html(this.signatureForm(contribution.id));
  }

  // Flag
  var flagField = meta.find(".node-flag");
  if (this.flagMap && this.flagMap[contribution.id]) {
    flagField.html(this.unflagForm(contribution.id, contribution.id));
  } else {
    flagField.html(this.flagForm(contribution.id));
  }

  return new_node;
};

WebTelephone.NodeConstructor.prototype.signatureForm = function (id) {
  var formString = "" +
    "<span id='contribution-" +
    id +
    "-signature'>" +
    "<form class='contribution-signature'>" +
    "<input id='contribution-" + id + "-signature-input' " +
    "type='text' data-contribution-id='" + id + "' " +
    "class='signature-input' placeholder='sign it!' />" +
    "<input type='submit' value='sign' class='signature-button' />" +
    "</form></span>";

  return formString;
};

WebTelephone.NodeConstructor.prototype.flagForm = function (id) {
  var formString = "" +
    "<span id='contribution-" +
    id +
    "-flag'>" +
    "<form class='contribution-flag'>" +
    "<input type='submit' value='flag'" +
    "data-contribution-id='" + id + "' " +
    "class='flag-button'" +
    "/></form></span>";

  return formString;
}

WebTelephone.NodeConstructor.prototype.unflagForm = function (contributionId, flagId) {
  var formString = "" +
    "<span id='contribution-" +
    contributionId +
    "-unflag'>" +
    "<form class='contribution-unflag'>" +
    "<input type='submit' value='unflag'" +
    "data-contribution-id='" + contributionId + "' " +
    "data-flag-id='" + flagId + "' " +
    "class='unflag-button'" +
    "/></form></span>";

  return formString;
}

