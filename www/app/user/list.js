/**
 * Webcomponent that shows a list of users.
 */
app.user.List = {
	/** HTML tag of this component. */
	tag: "user-list",
	/** URL of the template. */
	template: {url: "/app/user/list.tpl"}
};
app.user.List.prototype = {
	/**
	 * Method called when the component is created, and when it is rendered again without specific data.
	 * @param	object		params		Key/value pairs used as input. Filled with the attributes of the HTML node by default.
	 * @param	function	response	Function that should be called to display the component.
	 */
	created: function(params, response) {
		// if the requested userlist is fake, a static list is used
		if (params.userlist == "fake") {
			var data = {
				users: [
					{name: "Homer", age: 38},
					{name: "Marge", age: 34},
					{name: "Bart", age: 10},
					{name: "Lisa", age: 8},
					{name: "Maggie", age: 1}
				],
				userlist: params.userlist
			};
			response(data);
			return;
		}
		// if it's any other list, we send a request to the server (here a static JSON file is fetched)
		$.getJSON("/users.json", function(data) {
			data.userlist = params.userlist;
			response(data);
		});
	},
	/**
	 * Method called when an attribute of the component's HTML node is modified.
	 * @param	string	attrName	Name of the attribute.
	 * @param	string	oldVal		Former value.
	 * @param	string	newVal		New value.
	 */
	changed: function(attrName, oldVal, newVal) {
		// if an attribute is changed, ask for a rendering of the component - will call the created() method
		this.render();
	},
	/**
	 * Method used to change the list of users.
	 * @param	string	list	Name of the list. Will be used to fetch the user list.
	 */
	setUserList: function(list) {
		// change the "userlist" attribute of the component's HTML node
		$(this).attr("userlist", list);
	}
};
// creation of the webcomponent
sk.createComponent(app.user.List);
