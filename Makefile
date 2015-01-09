release: build_front
	$(MAKE) -C ./widget -B release

build_front:
	$(MAKE) -C ./front -B build
