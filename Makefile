install: install-deps

run:
	npm run babel-node -- 'src/bin/server.js'

install-deps:
	rm -rf node_modules
	npm install

build:
	rm -rf dist
	npm run build
	npm run webpack


test:
	npm test

lint:
	npm run eslint .

publish:
	npm publish

deploy:
	git push heroku master

.PHONY: test
