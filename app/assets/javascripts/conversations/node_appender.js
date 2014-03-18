WebTelephone.NodeConstructor = function (contribution, playerSubmissionIds, flagMap) {
  this.flagMap = flagMap;
  this.contribution = contribution;
  this.playerSubmissionIds = playerSubmissionIds;
};

WebTelephone.NodeConstructor.prototype.build = function() {
  var months = [ "January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December" ],
  new_node = JST["node_main"]({
    node: this.contribution,
    flagMap: this.flagMap,
    months: months,
    date: new Date(this.contribution.created_at),
    playerIsAuthor: !!this.playerSubmissionIds[this.contribution.id],
    nodeFlag: this.flagMap[this.contribution.id]
  });

  return new_node;
};
