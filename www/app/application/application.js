"use strict";
/**
 * Webcomponent that contains the whole application.
 */
app.Application = {
	/** HTML tag of this component. */
	tag: "application",
};
app.Application.prototype = {
	created: function(params, response) {
		var data = {};
		var url = sk.url.getParts();
		if (url.length == 3 && url[0] == "user") {
			data = {
				username: url[1],
				userage: url[2]
			};
		}
		response(data);
	}
};
// creation of the webcomponent
sk.createComponent(app.Application);
