// So-named because we can.

WebTelephone.NodeLoad = function( conversationObject ) {
  this.initialNodesArray = conversationObject.contributions;
  this.nodeRanking = {};
  this.rankNodes(this.initialNodesArray);
  this.$container = $('.js-node-sack');
  this.$blank_picture = $('#js-blank-picture');
  this.$blank_sentence = $('#js-blank-sentence');
  this.server_url = "/contributions/";
  this.pollForScroll;
  this.lazyLoader();
  console.log(this.lazyLoader());
  this.oldestNodeRank;
};

WebTelephone.NodeLoad.prototype.rankNodes = function (thread) {
  var contributions = thread
  , length = contributions.length
  , contribution
  , i;

  for (i = 0; i < length; i++) {
    contribution = contributions[i];
    this.nodeRanking[contribution.rank] = contribution;
  }
};

WebTelephone.NodeLoad.prototype.buildNodesFromThread = function( thread ) {
  var node;

  for (node = this._getStartNode( thread );
    !!node && !node.visible;
    node = this.nodeRanking[node.rank + 1] ) {
      node.visible = true;
      this.appendNode(node);
    }
};

// Returns the oldest node in thread
WebTelephone.NodeLoad.prototype._getStartNode = function ( thread ) {
  var lowest = thread[0]
  , length = thread.length
  , i;

  for (i = 0; i < length; i++) {
    thread[i].rank < lowest.rank ? lowest = thread[i] : null;
  }
  this.oldestNodeRank = lowest.rank;
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
  new_node.attr("data-rank", contribution.rank);
  new_node.find('.node-share').
  attr("href", "/?parent_id=" + contribution.id);
  new_node.find('.node-link')
  .attr("href", "/thank-you?thread_id=" +
    contribution.thread_id +
    "#" + contribution.id);
  meta = new_node.find('.node-meta');
  meta.find('.node-rank').html(contribution.rank);
  var location = contribution.author.location;
  meta.find('.node-region').html(location);

  // Will: "It's a bit intense on the dom, but could be a simple way of dealing with the craziness of infinite load"
  var parent_node = $('div').data("rank", (contribution.rank-1));
  if ($(parent_node).length === 0) {
    this.$container.append(new_node);
  }
  $(parent_node).before(new_node);
};

// Gets a thread from server.
WebTelephone.NodeLoad.prototype.getAncestorsFromServer = function( id ){
  if (!id) {
    console.info('Reached top of thread');
    clearInterval(this.pollForScroll);
    return;
  }
  $.get(
    "/contributions/" +
    "?top_id=" +
    id)
  .done(function (priorContributions) {
    this.rankNodes(priorContributions);
    this.buildNodesFromThread(priorContributions);
  }.bind(this))
  .fail(function (error) {
    console.log(error);
  })
};

// Function is for dev only, this will be converted to an infinite load script
WebTelephone.NodeLoad.prototype.lazyLoader = function() {
  var nearToBottom = 300;

  this.pollForScroll = setInterval(function() {
    if ($(window).scrollTop() + $(window).height() >
        $(document).height() - nearToBottom) {
      this.getAncestorsFromServer(this.nodeRanking[this.oldestNodeRank].parent_id);
    }
  }.bind(this), 2000);
}
