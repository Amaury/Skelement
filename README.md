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
