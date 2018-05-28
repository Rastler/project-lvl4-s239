install: install-deps install-flow-typed

run:
	npm run babel-node -- 'src/bin/hexlet.js' 10

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

.PHONY: test
