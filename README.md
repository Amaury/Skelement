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
<body sk-app-loader="/loader.js">
	<sk-title value="Test app" level="3"></sk-title>
</body>
</html>
```

- The `sk-app-loader` attribute of the `<body>` element contains the URL to the application loader (see below).
- Here there is only one element `<sk-title>`.


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
			level: params.level ? params.level : 1,
			value: params.value ? params.value : "Default Title"
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
<body sk-app-loader="/loader.js">
	<sk-title value="Test app">
		<h3>Test app</h3>
	</sk-title>
</body>
</html>
```


How to write a more complex object
----------------------------------

A webcomponent object is written in two steps. The first one contains data about the HTML tag and the template. The second one is the object's prototype, with methods called when the component is created, when the component's attributes are modified, and/or some private methods.

Webcomponent objects inherit one method, called `render()`. If this method is called without any parameter, the `created()` method is called, as if the component was just created. If the `render()` method is called with a parameter, it is used as template data.

```javascript
// object
var App = {
	// name of the custom tag of this component
	tag: "app",
	/* associated template − one of the three following keys */
	// direct template
	template: "Content of the template",
	// identifier of the <script> node that contains the template
	templateId: "identifier-of-the-node",
	// URL of the remote template file
	templateUrl: "url"
};
// object's prototype
App.prototype = {
	/**
	 * Method called when the component is created.
	 * Some code could be executed, and in the end the response callback must be called
	 * with template data given as parameter.
	 * @param	object		params		Attributes of the HTML element.
	 * @param	function	response	Handler function to call to set template data.
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


Post-template rendering callbacks
---------------------------------

Sometimes, you'll need to execute some code after a template is processed and injected in the page.

You can define a callback that will be executed each time a template is processed:
```javascript
sk.setPostRenderingCallback(function() {
    // here the code
});
```

Or you can define it for one element:
```javascript
var App = {
    tag: "app"
};
App.prototype = {
    created: function(params, response) {
        var data = {/*some data*/};
        response(data, function() {
            // here the code
        });
    }
};
```


Localisation
------------

An application could be localised, that is, translated, easily. First of all, you have to prepare some translation files in JSON format; one file per supported language.

Example of english translation:
```json
{
    "title": "My Application",
    "your name": "Your name",
    "your password": "Your password"
}
```

Example of french translation:
```json
{
    "title": "Mon application",
    "your name": "Votre nom",
    "your password": "Votre mot de passe"
}
```

Then you have to declare these files in the HTML bootstrap. The right translation will be loaded, depending of the locale setting of the user's navigator.
```html
<html>
<head>
	...
</head>
<body sk-app-loader="/loader.js" sk-l10n-fr="/l10n/fr.json" sk-l10n="/l10n/en.json">
	<sk-title value="Test app"></sk-title>
</body>
</html>
```

- The `sk-l10n-fr` attribute is used to set the path to the french translation file.
- The `sk-l10n` set the path to the default translation file.

Then, you can use the translations in your templates, thanks to the `{l10n}` plugin:
```smarty
<h1>{l10n}title{/l10n}</h1>
<label>{l10n}your name{/l10n}</label>
<label>{l10n}your password{/l10n}</label>
```

The result of this example will be, in english:
```html
<h1>My Application</h1>
<label>Your name</label>
<label>Your password</label>
```

And in french:
```html
<h1>Mon application</h1>
<label>Votre nom</label>
<label>Votre mot de passe</label>
```
