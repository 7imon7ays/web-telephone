// So-named because we can.

WebTelephone.NodeLoad = function( conversationObject ) {
  this.nodesArray = conversationObject.contributions;
  this.nodeRanking = {};
  this.rankNodes();
	this.$container = $('.js-node-sack');
	this.$blank_picture = $('#blank-picture');
	this.$blank_sentence = $('#blank-sentence');
  this.server_url = "/contributions/";
};

WebTelephone.NodeLoad.prototype.rankNodes = function () {
  var contributions = this.nodesArray
    , length = contributions.length
    , contribution
    , i;

  for (i = 0; i < length; i++) {
    contribution = contributions[i];
    this.nodeRanking[contribution.rank] = contribution;
  }
};

WebTelephone.NodeLoad.prototype.buildNodesFromThread = function() {
  var node;

  for (node = this._getStartNode();
      !!node;
      node = this.nodeRanking[node.rank + 1]
      ) { this.appendNode(node); }
};

WebTelephone.NodeLoad.prototype._getStartNode = function () {
  var lowest = this.nodesArray[0]
    , length = this.nodesArray.length
    , i;

  for (i = 0; i < length; i++) {
    this.nodesArray[i].rank < lowest.rank ? lowest = this.nodesArray[i] : null;
  }
  return lowest;
};

WebTelephone.NodeLoad.prototype.appendNode = function( contribution ){
	var new_node, meta;
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
  new_node.find('.node-share').
    attr("href", "/?parent_id=" + contribution.id);
  new_node.find('.node-link')
    .attr("href", "/thank-you?thread_id=" +
    contribution.thread_id +
    "#" + contribution.id);
	meta = new_node.find('.node-meta');
	meta.find('.node-rank').html(contribution.rank);
  // var location = contribution.author.location.replace(", ", "<br>"); // Eww.
  meta.find('.node-region').html(location);
	this.$container.prepend(new_node);
};

// Gets a thread from server.
WebTelephone.NodeLoad.prototype.getThreadFromServer = function( id , callback ){
  $.get("/conversations/for-contribution/" + id)
  .done(function (thread) {
    callback(thread);
  })
  .fail(function (error) {
    console.log(error);
  })
};