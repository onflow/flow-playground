
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
	$(info delete artifacts)
	$(EXEC) sh -c 'rm -rf artifacts'

.PHONY: install
install:
	$(info Task: install)
	$(info run "yarn install")
	$(EXEC) sh -c 'yarn || exit 255'

.PHONY: build
build:
	$(info Task: build production)
	$(EXEC) sh -c 'yarn build-production || exit 255'

.PHONY: test
test:
	$(info Task: test)
	$(info run "yarn test" in packages/*)
	$(EXEC) sh -c 'yarn test || exit 255'

.PHONY: ci
ci: clean install build
	$(info Task: ci)
	$(info run tests)
	$(EXEC) sh -c 'yarn test || exit 255'