PORT	= 8000

.PHONY: help server

help:
	@echo "make server	Launch test server."

server:
	cd www; php -S localhost:${PORT}

