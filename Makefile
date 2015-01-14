osx:
	TARGET=osx $(MAKE) -C ./front -B build
	$(MAKE) -C ./widget -B release

chrome:
	TARGET=chrome $(MAKE) -C ./front -B build
