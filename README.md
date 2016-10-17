Skelement
=========

Simple Javascript framework.


How to test
-----------

You'll need PHP-CLI.

```shell
$ make server
```

Then open your navigator on `http://localhost:8000`.


Source tree
-----------

Here is the source tree of the example application:

```
.
├── Makefile                    Commands execution tool
├── README.md                   This documentation
└── www
    ├── app                     Application's folder
    │   ├── user                app.user namespace's folder
    │   │   ├── card.js         app.user.card object
    │   │   ├── card.tpl        app.user.card's template
    │   │   ├── list.js         app.user.list object
    │   │   └── list.tpl        app.user.list's template
    │   └── user.js             app.user object
    ├── app.js                  Application loader
    ├── index.html              Bootstrap HTML file
    ├── js                      Javascript Libraries
    │   ├── jquery.min.js
    │   ├── skelement.js
    │   └── smart.min.js
    └── users.json              Example of external loadable JSON file.

```

How to write an object
----------------------

```javascript
var App = {
	// name of the custom tag of this component
	tag: "app",
	// associated template
	// - if not set, will used a template defined inside the HTML file, with an attribute id="tpl-app"
	// - it could be a string that contains the template itself
	// - it could be an object with the key "id" (for a template in HTML) or the key "url" (to fetch the template from an external file)
	template: {url: "/app.tpl"}
};
App.prototype = {
	/**
	 * Method called when the component is created.
	 * @param	object		params		Attributes of the HTML element.
	 * @param	function	response	Handler to call to set data.
	 */
	created: function(params, response) {
		if (params.listType == "kids")
			response({characters: ["Bart", "Lisa"]});
		else
			response({characters: ["Homer", "Marge"]});
	},
	/**
	 * Method called when an attribute of the HTML node is modified.
	 * @param	string	attrName	Name of the attribute.
	 * @param	string	oldVal		Former value of the attribute.
	 * @param	string	newVal		New value.
	 */
	changed: function(attrName, oldVal, newVal) {
		// call a method to render again the whole component
		this.render();
	},
	/**
	 * Some other method, not automatically called by the framework.
	 */
	setListType: function(newType) {
		$(this).attr("listType", newType);
	}
};
```

How to write a template
-----------------------

Templates are written using [Smarty](http://www.smarty.net) syntax.

Here is an example of template in a separate file:
```smarty
{if $characters}
	<ul>
		{foreach from=$characters item=character}
			<li>{$character|escape}</li>
		{/foreach}
	</ul>
{else}
	Nothing to show
{/if}
```

You can also use templates inside HTML:
```html
<script id="tpl-app" type="text/x-tpl-smarty">
	{* content of the template *}
</script>
```
