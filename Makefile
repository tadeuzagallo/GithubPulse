release: front
	$(MAKE) -C ./widget release

front:
	$(MAKE) -C ./front build
