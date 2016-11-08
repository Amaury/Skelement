PORT	= 8000

.PHONY: help server framework application loader

help:
	@echo " make loader       Generate application's loader file."
	@echo " make application  Generate application's minified file."
	@echo " make server       Launch test server."
	@echo " make framework    Generate framework's minified file."

server:
	@echo "Starting local webserver"
	cd www; php -S localhost:${PORT}

framework:
	@echo "Generation of framework's minified file"
	bin/generateApp.php --framework

application:
	@echo "Generation of application's minified file"
	bin/generateApp.php --application

loader:
	@echo "Generation of application's loader file"
	bin/generateApp.php --loader

