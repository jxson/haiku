
PATH := node_modules/.bin:$(PATH)
SHELL := /bin/bash -e -o pipefail

VERSION := patch
JS := $(shell find lib test -name "*.js" )

node_modules: package.json
	@npm prune
	@npm install
	@touch node_modules

coverage: $(JS) node_modules
	@istanbul cover --report html --print detail ./test/index.js

coveralls: coverage
	@istanbul report lcov && (cat coverage/lcov.info | coveralls)

clean:
	@$(RM) -fr test/source/build
	@$(RM) -fr node_modules $(STANDALONE).js
	@$(RM) -fr npm-debug.log
	@$(RM) -fr coverage

test: node_modules
	@prova test/test-*.js

travis: test coveralls

release:
	npm version $(VERSION)
	git push && git push --tags
	npm publish

.PHONY: clean release test
