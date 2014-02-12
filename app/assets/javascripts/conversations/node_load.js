// So-named because we can.

WebTelephone.NodeLoad = function( object ) {
	console.log(object);
	this.thread = object;
	this.$container = $('.js-node-sack');
	this.$blank_picture = $('#blank-picture');
	this.$blank_sentence = $('#blank-sentence');
  this.server_url = "/contributions/";
}

WebTelephone.NodeLoad.prototype.buildNodesFromThread = function() {
	var nodes = this.thread.contributions;
	for (var i = 0; i < nodes.length; i++) {
		this.appendNode(nodes[i]);
	}
};

WebTelephone.NodeLoad.prototype.appendNode = function( contribution ){
	var new_node, meta;
	console.log(contribution);
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
  new_node.find('.node-share').attr("href", "/?parent_id=" + contribution.id);
	meta = new_node.find('.node-meta');
	meta.find('.node-number').html(contribution.id);
  // var location = contribution.author.location.replace(", ", "<br>"); // Eww.
  meta.find('.node-region').html(location);
	this.$container.prepend(new_node);
}

// Gets a thread from server.
WebTelephone.NodeLoad.prototype.getThreadFromServer = function( id , callback ){

}