// So-named because we can.

WebTelephone.NodeLoad = function( conversationObject, flagMap ) {
  this.$window = $(window);
  this.nodeRanking = {};
  this.rankNodes(conversationObject.contributions);
  this.setYoungestNode(conversationObject.contributions);
  this.flagMap = flagMap;
  this.$container = $('.js-node-sack');
  this.$sub_loading = $('.submission-loading');
  this.$share_top = $('#js-share-top');
  this.cta_share = $('.cta-share');
  this.server_url = "/contributions/";
  this.playerSubmissionIds = this._getContributionIds();
};

WebTelephone.NodeLoad.prototype.buildNodesFromThread = function( nodes, linkId ) {
  var node
    , newNode
    , chainString = ""
    , Constructor = WebTelephone.NodeConstructor
    , formerYoungestNode = this.youngestNode;

  this.setYoungestNode(nodes);

  for ( node = this.youngestNode;
      !!node && !node.visible;
      node = this.nodeRanking[node.rank + 1] ) {
        node.visible = true;
        newNode = new Constructor(
            node, this.playerSubmissionIds, this.flagMap
          ).build();
        chainString = newNode.concat(chainString);
      }

  var appendingFromInfiniteLoad = !!linkId;

  if (appendingFromInfiniteLoad) {
    var $parentNode = $("#" + formerYoungestNode.id);
    $parentNode.after(chainString);
  } else {
    this.$container.append(chainString);
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
WebTelephone.NodeLoad.prototype.infiniteLoad = function( linkId ){
  if (!linkId) {
    this.$sub_loading.html("You've reached the top. Go eat a sandwich.");
     this.$window.off("scroll");
    return;
  }

  $.get(
    "/contributions/" +
    "?top_id=" +
    linkId)
  .done(function (priorContributions) {
    this.rankNodes(priorContributions);
    this.buildNodesFromThread(priorContributions, linkId);
  }.bind(this))
  .fail(function (error) {
    console.log(error);
  })
};

WebTelephone.NodeLoad.prototype.pollForScroll = function () {
  var throttledInfiniteScroll = $.throttle(
    this.infiniteScroll.bind(this),
    200
  );

  this.$window.on("scroll", throttledInfiniteScroll);
  return this;
};

WebTelephone.NodeLoad.prototype.infiniteScroll = function () {
  var cta_is_visible = false;

  // If near bottom, get more nodes
  if (this.$window.scrollTop() > $(document).height() - this.$window.height() - 50) {
    var missingLinkId = this.youngestNode.parent_id;
    this.infiniteLoad(missingLinkId);
  }

  // If below initial call to action (CTA) to share the site, show alternate CTA
  if ( ((this.$share_top[0].offsetTop + this.$share_top[0].offsetHeight)
        < this.$window.scrollTop() )
        && !cta_is_visible ) {
        this.cta_share.removeClass('hidden');
        cta_is_visible = true;
  }
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

WebTelephone.NodeLoad.prototype.setYoungestNode = function (nodes) {
  var youngest = nodes[0]
    , length = nodes.length
    , node
    , i;

  for (i = 0; i < length; i++) {
    node = nodes[i];
    node.rank < youngest.rank ? youngest = node : null;
  }

  this.youngestNode = youngest;
};

WebTelephone.NodeLoad.prototype.rankNodes = function (nodes) {
  var length = nodes.length
    , node
    , i;

  for (i = 0; i < length; i++) {
    node = nodes[i];
    this.nodeRanking[node.rank] = node;
  }
};
