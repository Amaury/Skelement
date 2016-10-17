app.user.List = {
	tag: "user-list",
	template: {url: "/tpl/app.user.list.tpl"}
};
app.user.List.prototype = {
	created: function(params, response) {
		console.log("app.user.List.created()");
		if (params.userlist == "first")
			response({users: ["Alice", "Bob", "Carine"]});
		else {
			$.getJSON("/users.json", response);
		}
	},
	changed: function(attrName, oldVal, newVal) {
		console.log("app.user.List.changed()");
		this.render();
	},
	setUserList: function(list) {
		$(this).attr("userlist", list);
	},
	sayHello: function() {
		alert("Hello");
	},
	addUserToList: function(str) {
		$(this).append("<sk-user-card name='" + str + "'></sk-user-card>");
	},
};
sk.createComponent(app.user.List);
