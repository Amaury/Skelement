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
├── bin/                                Command-line tools directory
├── Makefile                            Commands execution tool
├── README.md                           This documentation
└── www/
    ├── app/                            Application's folder
    ├── index.html                      Bootstrap HTML file
    ├── js/                             Javascript Libraries
    ├── l10n/                           Localisation folder
    ├── loader.txt                      Application loader
    └── style.css                       CSS styles
```


Bootstrapping the framework
---------------------------

```html
<html>
<head>
	<title>Skelement example application</title>
	<meta charset="UTF-8"/>
	<meta name="viewport" content="width=device-width, initial-scale=1"/>

	<!-- CSS STYLE -->
	<link rel="stylesheet" type="text/css" href="/style.css" />

	<!-- Basic Javascript libraries (polyfill, jQuery, jSmart) and Skelement framework -->
	<script type="text/javascript" src="/js/skelement-loader.js"></script>
</head>
<body sk-app-loader="/loader.js" sk-l10n-fr="/l10n/fr.json" sk-l10n="/l10n/en.json">
	<sk-title value="Test app"></sk-title>
</body>
</html>
```

- The `sk-app-loader` attribute of the `<body>` element contains the URL to the application loader (see below).
- Here the `sk-l10n-fr` attribute defines the localisation file for french language.
- Here the `sk-l10n` attribute defines the localisation file for any other language.
- Here the whole application is defined by the `<sk-application>` element.


The application loader
----------------------

This file contains just a list of instructions that will be used to load the Javascript files of the application.

```
# comment lines start with '#'
/app/title.js
```


How to write a basic object
---------------------------

The simplest object contains its own template, and just one method which is called when the component is created:

```javascript
var Title = {
	// HTML tag of this component (without the "sk-" prefix)
	tag: "title",
	// template associated to the component
	template: "<h{$level}>{$value|escape}</h{$level}>"
};
Title.prototype = {
	created: function(params, response) {
		response({
			level: (params.level != undefined) ? params.level : 1,
			value: (params.value != undefined && params.value.length) ? params.value : "Default Title"
		});
	}
};
// create the webcomponent for the tag "sk-title"
sk.createComponent(Title);
```

The result will be:
```html
<html>
<head>
	...
</head>
<body sk-app-loader="/loader.js" sk-l10n-fr="/l10n/fr.json" sk-l10n="/l10n/en.json">
	<sk-title value="Test app">
		<h1>Test app</h1>
	</sk-title>
</body>
</html>
```


How to write a more complex object
----------------------------------

```javascript
var App = {
	// name of the custom tag of this component
	tag: "app",
	// associated template
	// - if not set, will used a template defined inside the HTML file, with an attribute id="tpl-app"
	// - it could be a string that contains the template itself
	// - it could be an object with the key "id" (for a template in HTML) or the key "url"
	//   (to fetch the template from an external file)
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
sk.createComponent(App);
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
