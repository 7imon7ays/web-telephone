// So-named because we can.

WebTelephone.NodeLoad = function( conversationObject ) {
  this.initialNodesArray = conversationObject.contributions;
  this.nodeRanking = {};
  this._rankNodes(this.initialNodesArray);
  this.$container = $('.js-node-sack');
  this.server_url = "/contributions/";
  this.pollForScroll;
  this.lazyLoader();
  this.oldestNodeRank;
  this.playerSubmissionIds = this._getContributionIds();
};

WebTelephone.NodeLoad.prototype._rankNodes = function (thread) {
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
  this.listenForSignature();
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

WebTelephone.NodeLoad.prototype._getContributionIds = function () {
  var idsString = window.sessionStorage.getItem("contributions");
  if (!idsString) { return {}; }

  var length = idsString.length
    , ids = {}
    , id = ""
    , i = 0;

  while (i < length) {
    if (idsString[i] == ",") {
      ids[id] = true;
      id = "";
    } else {
      id += idsString[i];
    }
    i++;
  }
  ids[id] = true;

  return ids;
};

WebTelephone.NodeLoad.prototype.appendNode = function( contribution ){
  var nodeBuilder = new WebTelephone.NodeBuilder(contribution, this.playerSubmissionIds)
    , new_node = nodeBuilder.build();

  // Will: "It's a bit intense on the dom, but could be a simple way of dealing with the craziness of infinite load"
  var parent_node = $('*[data-rank="' + (contribution.rank - 1) + '"]');
  if (parent_node.length === 0) {
    this.$container.append(new_node);
  }
  else {
    $(parent_node).before(new_node);
  }
};

WebTelephone.NodeLoad.prototype.listenForSignature = function () {
  var self = this;

  $(".signature-input").on("focus", function () {
    $(document).on("keyup", function (event) {
      if (event.which == 13) { self.submitSignature(event); }
    });
  });
};

WebTelephone.NodeLoad.prototype.submitSignature = function (event) {
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
    var $field = $("#contribution-" + contribution.id + "-signature" );
    $field.html(contribution.signature);
  })
  .fail(function (error) {
    console.log(error);
  });
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
    this._rankNodes(priorContributions);
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
  }.bind(this), 1000);
};
