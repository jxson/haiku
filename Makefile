
VERSION = patch
MOCHA = ./node_modules/.bin/mocha

node_modules: package.json
	@npm prune
	@npm install

clean:
	@$(RM) -fr test/source/build
	@$(RM) -fr node_modules $(STANDALONE).js
	@$(RM) -fr npm-debug.log

test: node_modules
	@$(MOCHA) test/test-*.js

release:
	npm version $(VERSION)
	git push && git push --tags
	npm publish

.PHONY: clean release test
