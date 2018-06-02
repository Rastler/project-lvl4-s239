install: install-deps

run:
	npm run babel-node -- 'src/bin/server.js'

install-deps:
	rm -rf node_modules
	npm install

build-dev:
	rm -rf dist
	npm run build
	npm run webpack-dev

build-production:
	rm -rf dist
	npm run build
	npm run webpack-production
	
test:
	npm test

lint:
	npm run eslint .

publish:
	npm publish

deploy:
	git push heroku master

.PHONY: test
