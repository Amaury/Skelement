PORT	= 8000

.PHONY: help server app

help:
	@echo " make server       Launch test server."
	@echo " make skelement    Generate framework's minified file."
	@echo " make app          Generate application's minified file."

server:
	@echo "Starting local webserver"
	cd www; php -S localhost:${PORT}

skelement:
	@echo "Generation of framework's minified file"
	bin/generateApp.php framework

app:
	@echo "Generation of application's minified file"
	bin/generateApp.php application
