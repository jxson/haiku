
PATH := node_modules/.bin:$(PATH)
SHELL := /bin/bash -e -o pipefail

VERSION := patch

node_modules: package.json
	@npm prune
	@npm install

clean:
	@$(RM) -fr test/source/build
	@$(RM) -fr node_modules $(STANDALONE).js
	@$(RM) -fr npm-debug.log

test: node_modules
	prova test/test-*.js

release:
	npm version $(VERSION)
	git push && git push --tags
	npm publish

.PHONY: clean release test
