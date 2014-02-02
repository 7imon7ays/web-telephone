var WebTelephone = {};

jQuery(document).ready(function($) {

	var thread = $.parseJSON($('#bootstrapped-thread-json').html());
	new WebTelephone.NodeLoad(thread).buildLinks();

});