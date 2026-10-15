# Release entry points. Thin wrappers over work-scripts/node/release/cli.mjs; CI runs the same targets.
# The default goal prints help and never builds or publishes.
.DEFAULT_GOAL := help
RELEASE := node work-scripts/node/release/cli.mjs

# Operator inputs are exported and read from the environment, never interpolated into shell text.
export TARBALL TAG REGISTRY CONFIRM ARTIFACTS ALLOW_DIRTY DRY_RUN

.PHONY: help sdk-check sdk-build release-pack release-verify release-check release-publish

help:
	@echo 'make sdk-check                      typecheck, lint, unit/property/API and release tests'
	@echo 'make sdk-build                      regenerate dist-sdk only'
	@echo 'make release-pack                   build once, pack once, record evidence under artifacts/release/'
	@echo 'make release-verify TARBALL=<abs>   inspect and install that exact tarball (ESM, CJS, TS, browser, README)'
	@echo 'make release-check                  sdk-check -> release-pack -> release-verify; no publication, no tags'
	@echo 'make release-publish TARBALL=<abs> TAG=<dist-tag> REGISTRY=<url> CONFIRM="publish name@version sha12"'
	@echo '                                    explicit operator action; DRY_RUN=1 for npm --dry-run. See docs/release/runbook.md'

sdk-check:
	$(RELEASE) sdk-check

sdk-build:
	$(RELEASE) sdk-build

release-pack:
	$(RELEASE) pack

release-verify:
	$(RELEASE) verify

release-check:
	$(RELEASE) check

release-publish:
	$(RELEASE) publish
