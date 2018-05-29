install: install-deps

run:
	npm run babel-node -- 'src/bin/server.js'

install-deps:
	npm install

build:
	rm -rf dist
	npm run build

test:
	npm test

lint:
	npm run eslint .

publish:
	npm publish

deploy:
	rm -rf dist
	npm run build
	git push heroku master

.PHONY: test
