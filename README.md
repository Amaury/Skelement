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
├── bin                                 Command-line tools directory
│   └── generateApp.php                 App packaging tool
├── Makefile                            Commands execution tool
├── README.md                           This documentation
└── www
    ├── app                             Application's folder
    │   ├── title.js                    app.title object
    │   ├── user                        app.user namespace's folder
    │   │   ├── card.js                 app.user.card object
    │   │   ├── card.tpl                app.user.card's template
    │   │   ├── list.js                 app.user.list object
    │   │   └── list.tpl                app.user.list's template
    │   └── user.js                     app.user object
    ├── app.js                          Application root namespace
    ├── index.html                      Bootstrap HTML file
    ├── js                              Javascript Libraries
    │   ├── jquery.min.js               jQuery
    │   ├── skelement                   Skelement source directory
    │   │   ├── sk._core.js             Core object
    │   │   ├── sk._core.network.js     Network management object
    │   │   ├── sk._core.ui.js          Tempaltes management object
    │   │   └── sk.js                   Public interface
    │   └── smart.min.js                jSmart
    ├── loader.js                       Application loader
    ├── style.css                       CSS styles
    └── users.json                      Example of external loadable JSON file.
```


Bootstrapping the framework
---------------------------

```html
<html>
<head>
	<!-- *** JAVASCRIPT LIBRARIES *** -->
	<!-- jQuery -->
	<script type="text/javascript" src="/js/jquery.min.js"></script>
	<!-- jSmart (Smarty template engine) -->
	<script type="text/javascript" src="/js/smart.min.js"></script>
	<!-- Skelement (JS Application Framework) -->
	<script type="text/javascript" src="/js/skelement/sk.js"></script>
	<script type="text/javascript" src="/js/skelement/sk._core.js"></script>
	<script type="text/javascript" src="/js/skelement/sk._core.network.js"></script>
	<script type="text/javascript" src="/js/skelement/sk._core.ui.js"></script>

	<!-- CSS STYLE -->
	<link rel="stylesheet" type="text/css" href="/style.css" />
</head>
<body sk-app-loader="/loader.js">
	<sk-application></sk-application>
</body>
</html>
```

- The `sk-app-loader` attribute of the `<body>` element contains the URL to the application loader.
- Here the whole application is defined by the `<sk-application>` element.


The application loader
----------------------

This file contains just a list of instructions that will be used to load the Javascript files of the application.

```javascript
sk.load("/app.js");
sk.load("/app/application.js");
sk.load("/app/title.js");
sk.load("/app/connection.js");
sk.load("/app/user.js");
sk.load("/app/user/list.js");
sk.load("/app/user/card.js");
```


How to write a basic object
---------------------------

The simplest object contains its own template, and just one method which is called when the component is created:

```javascript
var Title = {
	// HTML tag of this component (without the "sk-" prefix)
	tag: "title",
	// template associated to the component
	template: "{if $level == 1}<h1>{else}<h2>{/if}{$value|escape}{if $level == 1}</h1>{else}</h2>{/if}"
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

And use this HTML file:
````html
<html>
<head>
	<script type="text/javascript" src="/js/jquery.min.js"></script>
	<script type="text/javascript" src="/js/smart.min.js"></script>
	<script type="text/javascript" src="/js/skelement.js"></script>
	<script type="text/javascript" src="/title.js"></script>
</head>
<body>
	<sk-title level="1" value="Page Title"></sk-title>
</body>
</html>
````


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
