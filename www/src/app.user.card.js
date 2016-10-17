app.user.Card = {
	tag: "user-card",
	template: {url: "/tpl/app.user.card.tpl"}
};
app.user.Card.prototype = {
	created: function(attributes, response) {
		var login = this._doubleString(attributes.name);
		response({login: login});
	},
	_doubleString: function(s) {
		return (s + s);
	}
};
sk.createComponent(app.user.Card);
