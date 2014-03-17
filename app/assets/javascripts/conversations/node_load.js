// So-named because we can.

WebTelephone.NodeLoad = function( conversationObject, flagMap ) {
  this.initialNodesArray = conversationObject.contributions;
  this.flagMap = flagMap;
  this.nodeRanking = {};
  this._rankNodes(this.initialNodesArray);
  this.$container = $('.js-node-sack');
  this.$sub_loading = $('.submission-loading');
  this.$share_top = $('#js-share-top');
  this.cta_share = $('.cta-share');
  this.server_url = "/contributions/";
  this.playerSubmissionIds = this._getContributionIds();
};

WebTelephone.NodeLoad.prototype.appendNode = function( contribution ){
  var nodeConstructor = new WebTelephone.NodeConstructor(
      contribution, this.playerSubmissionIds, this.flagMap
    )
    , new_node = nodeConstructor.build();
  // Will: "It's a bit intense on the dom, but could be a simple way of dealing with the craziness of infinite load"
  var parent_node = $('*[data-rank="' + (contribution.rank - 1) + '"]');
  if (parent_node.length === 0) {
    this.$container.append(new_node);
  }
  else {
    $(parent_node).before(new_node);
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
  return this;
};

WebTelephone.NodeLoad.prototype.clipboardCopier = function() {
  $(document).on('click', '.js-copy-to-clip', function(e) {
    this.copyToClipboard(e, e.target.href);
  }.bind(this));

  return this;
}

WebTelephone.NodeLoad.prototype.copyToClipboard = function(e, text) {
  e.preventDefault();
  window.prompt("Copy this link, then pass it to somebody:", text);
}

// Gets a thread from server.
WebTelephone.NodeLoad.prototype.getAncestorsFromServer = function( id ){
  if (!id) {
    this.$sub_loading.html("You've reached the top. Go eat a sandwich.");
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
WebTelephone.NodeLoad.prototype.pollForScroll = function() {
  var cta_is_visible = false;
  var nearToBottom = 300;

  this.pollForScroll = setInterval(function() {

    // If near bottom, get more nodes
    if ($(window).scrollTop() + $(window).height() >
        $(document).height() - nearToBottom) {
      this.getAncestorsFromServer(this.nodeRanking[this.oldestNodeRank].parent_id);
    }

    // If below initial call to action (CTA) to share the site, show alternate CTA
    if (((this.$share_top[0].offsetTop + this.$share_top[0].offsetHeight) < $(window).scrollTop())
          && !cta_is_visible ){
      this.cta_share.removeClass('hidden');
      cta_is_visible = true;
    }
  }.bind(this), 1000);

  return this;
};

WebTelephone.NodeLoad.prototype.listenForUserInputs = function () {
  $("body").on("submit", "form", function (e) {
    e.preventDefault();
    var $target = $(e.target);

    switch($target.attr("class")) {
      case "contribution-signature":
        var $signatureField = $target.find("input[type='text']");
        new WebTelephone.NodeSigner($signatureField, $(".overlay.js-error-form"))
          .submitSignature();
      break;
      case "contribution-flag":
        new WebTelephone.NodeFlagger($target, $(".overlay.js-error-form"))
          .flag();
      break;
      case "contribution-unflag":
        new WebTelephone.NodeFlagger($target, $(".overlay.js-error-form"))
          .unflag();
      break;
    }
  });

  $("body").on("click", ".js-reveal-flagged", function (e) {
    $(this).parents('.holder-main').addClass('flagged-but-revealed');
  });

  return this;
};

WebTelephone.NodeLoad.prototype.moreToggle = function() {
  $(document).on('click', '.js-meta-toggle', function(e){
    var $node_more = $(this).closest('.holder-main').find($('.node-meta'));
    $node_more.toggleClass('js-is-visible');
  });

  return this;
}

// Returns the oldest node in thread
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
