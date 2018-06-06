install: install-deps

run:
	npm run nodemon -- --exec babel-node ./dist/bin/server.js

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

deploy:
	git push heroku master

test-coverage:
	npm test -- --coverage

.PHONY: test
