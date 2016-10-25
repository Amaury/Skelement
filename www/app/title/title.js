"use strict";
/**
 * Webcomponent that show the title of the page.
 */
app.Title = {
	/** HTML tag of this component. */
	tag: "title",
	/** Template used to display this component. */
	template: "<h1>{$value|escape}</h1>"
};
app.Title.prototype = {
	/**
	 * Method called when the component is created, and when it is rendered again without specific data.
	 * @param	object		params		Key/value pairs used as input. Filled with the attributes of the HTML node by default.
	 * @param	function	response	Function that should be called to display the component.
	 */
	created: function(params, response) {
		var value = (params.value == undefined) ? "Users list" : params.value;
		// send back the data to the response handler
		response({value: value});
	},
};
// creation of the webcomponent
sk.createComponent(app.Title);
