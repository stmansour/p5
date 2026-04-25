DIST ?= dist
PACKAGE_DIR := $(DIST)/code

REL_USER_HOST ?= sman@stevemansour.com
REL_SSH := ssh -i ~/.ssh/id_sman -p 1291
REL_RSYNC_SSH := ssh -i ~/.ssh/id_sman -p 1291
REMOTE_DIR ?= ~/public_html/code
REMOTE_NEW := $(REMOTE_DIR).new
REMOTE_BAK := $(REMOTE_DIR).bak

.PHONY: help clean package relsman release

help:
	@echo "Targets:"
	@echo "  make package  Build release tree in $(PACKAGE_DIR)"
	@echo "  make relsman  Deploy p5 examples to stevemansour.com"
	@echo "  make clean    Remove local release artifacts"

clean:
	rm -rf "$(DIST)"

package:
	rm -rf "$(PACKAGE_DIR)"
	mkdir -p "$(PACKAGE_DIR)/p5"
	test -f p5.js
	rsync -a --delete examples/ "$(PACKAGE_DIR)/p5/"
	cp p5.js "$(PACKAGE_DIR)/p5.js"

relsman: package
	rsync -az --delete -e "$(REL_RSYNC_SSH)" "$(PACKAGE_DIR)/" "$(REL_USER_HOST):$(REMOTE_NEW)/"
	$(REL_SSH) $(REL_USER_HOST) 'rm -rf $(REMOTE_BAK) && if [ -d $(REMOTE_DIR) ]; then mv $(REMOTE_DIR) $(REMOTE_BAK); fi && mv $(REMOTE_NEW) $(REMOTE_DIR) && rm -rf $(REMOTE_BAK)'

release: relsman
