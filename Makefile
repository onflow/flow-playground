
.PHONY: default
default:
	$(info Available Make Commands)
	@awk -F: '/^[A-z\-_]+\:/ {print "  - make " $$1}' Makefile | sort

.PHONY: all
all: clean install build test
	$(info Task: all)

.PHONY: doctor
doctor: clean install build test
	$(info TSK: doctor)

.PHONY: clean
clean:
	$(info Task: clean)
	$(info delete node_modules)
	$(EXEC) sh -c 'rm -rf node_modules'
	$(info delete dist)
	$(EXEC) sh -c 'rm -rf dist'

.PHONY: install
install:
	$(info Task: install)
	$(EXEC) sh -c 'npm install || exit 255'

.PHONY: build
build:
	$(info Task: build production)
	$(EXEC) sh -c 'npm run build || exit 255'

.PHONY: test
test:
	$(info Task: test)
	$(EXEC) sh -c 'npm run test || exit 255'

.PHONY: ci
ci: clean install build test
