"use strict";
/**
 * Webcomponent that show the ID card of a user.
 */
app.user.Card = {
	/** HTML tag of this component. */
	tag: "user-card",
	/** The associated template. */
	template: "<div class='user'><strong>{$name|escape}</strong> ({$age})</div>"
	// could also be an external template
	//template: {url: "/tpl/app.user.card.tpl"}
};
app.user.Card.prototype = {
	/**
	 * Method called when the component is created, and when it is rendered again without specific data.
	 * @param	object		params		Key/value pairs used as input. Filled with the attributes of the HTML node by default.
	 * @param	function	response	Function that should be called to display the component.
	 */
	created: function(params, response) {
		// call a private function
		params.name = this._processName(params.name);
		// send back the data to the response handler
		response(params);
	},
	/**
	 * Private method. Modify the given string.
	 * @param	string	s	The input string.
	 * @return	string	The input string repeated twice.
	 */
	_processName: function(s) {
		if (s.indexOf("Arnold") != -1)
			return (s + " (Terminator)");
		if (s.indexOf("Sylvester") != -1)
			return (s + " (Rambo)");
		return (s);
	}
};
// creation of the webcomponent
sk.createComponent(app.user.Card);
