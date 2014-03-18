WebTelephone.NodeConstructor = function (node, playerSubmissionIds, flagMap) {
  this.node = node;
  this.playerSubmissionIds = playerSubmissionIds;
  this.flagMap = flagMap;
};

WebTelephone.NodeConstructor.prototype.build = function() {
  var blobField = this.makeBlobField()
    , signatureField = this.makeSignatureField()
    , flagField = this.makeFlagField()
    , node = this.node
    , isFlaggedByPlayer = !!this.flagMap[node.id]
    , timeStamp = new Date(node.created_at)
    , months = [ "January", "February", "March",
                  "April", "May", "June",
                  "July", "August", "September",
                  "October", "November", "December" ]
    , date = months[timeStamp.getMonth()] + ' ' +
            timeStamp.getDate() + ', ' +
            timeStamp.getFullYear();

  var new_node = JST["node_main"]({
    node: node,
    blobField: blobField,
    isFlaggedByPlayer: isFlaggedByPlayer,
    date: date,
    signatureField: signatureField,
    flagField: flagField
  });

  return new_node;
};

WebTelephone.NodeConstructor.prototype.makeBlobField = function () {
  var node = this.node;

  if (node.category == "sentence") {
    return JST["_node_sentence"]({
      node: node
    });
  } else {
    return JST["_node_picture"]({
      node: node
    })
  }
};

WebTelephone.NodeConstructor.prototype.makeSignatureField = function () {
  var node = this.node
    , playerIsAuthor = !!this.playerSubmissionIds[node.id];

  if (node.signature && node.signature != "") {
    return JST["_node_signature"]({
      node: node
    });
  } else if (playerIsAuthor) {
    return JST["_node_sign"]({
      node: node
    });
  } else {
    return ""
  }
};

WebTelephone.NodeConstructor.prototype.makeFlagField = function () {
  var node = this.node;

  if ( nodeFlag = this.flagMap[node.id] ) {
    return JST["_node_unflag"]({
      nodeId: node.id,
      nodeFlag: nodeFlag
    });
  } else {
    return JST["_node_flag"]({
      nodeId: node.id
    });
  }
};