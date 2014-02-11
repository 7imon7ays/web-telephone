// So-named because we can.

WebTelephone.NodeLoad = function( object ) {
	this.thread = object;
	this.$container = $('.js-node-sack');
	this.$blank_picture = $('#blank-picture');
	this.$blank_sentence = $('#blank-sentence');
  this.server_url = "/contributions/";
}

WebTelephone.NodeLoad.prototype.buildLinks = function() {
	var nodes = this.thread.contributions;
	for (var i = 0; i < nodes.length; i++) {
		this.appendNode(nodes[i]);
	}
};

WebTelephone.NodeLoad.prototype.appendNode = function( contribution ){
	var new_node, meta;
	if (contribution.category === "sentence") {
		new_node = this.$blank_sentence.clone();
		this.getFromServer(contribution.id , function(data) {
			new_node.find('.saved-sentence').html(data);
		});
	} else {
		new_node = this.$blank_picture.clone();
		this.getFromServer(contribution.id , function(data) {
			new_node.find('.saved-picture').attr("src", data);
		});
	}
	new_node.attr("id", contribution.id);
  new_node.find('.node-share').attr("href", "/?parent_id=" + contribution.id);
	meta = new_node.find('.node-meta');
	meta.find('.node-number').html(contribution.id);
  var location = contribution.author.location.replace(", ", "<br>"); // Eww.
  meta.find('.node-region').html(location);
	this.$container.prepend(new_node);
}

WebTelephone.NodeLoad.prototype.getFromServer = function( id , callback ){
	var url = this.server_url + id;

	$.get(url, function (data) {
		callback(data.blob);
	});
}