release:
	npm version minor
	git push && git push --tags
	npm publish
