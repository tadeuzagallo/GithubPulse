WEBPACK := node ../node_modules/webpack/bin/webpack.js
DEV_SERVER := node ../node_modules/webpack-dev-server/bin/webpack-dev-server.js

chrome:
	TARGET=chrome $(WEBPACK)

osx:
	TARGET=osx $(WEBPACK)

chrome.watch:
	TARGET=chrome $(WEBPACK) --watch

osx.watch:
	TARGET=osx $(DEV_SERVER)

.PHONY: chrome osx chrome.watch osx.watch
