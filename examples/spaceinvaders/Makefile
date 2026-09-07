PORT ?= 8000
ROOT_DIR := ../..
URL := http://localhost:$(PORT)/examples/spaceinvaders/

.PHONY: help serve server open

help:
	@echo "Targets:"
	@echo "  make serve   Start local web server and display game URL"
	@echo "  make open    Start server and open browser automatically"
	@echo ""
	@echo "Override port example: make serve PORT=8080"

serve:
	@echo ""
	@echo "========================================================"
	@echo " Space Invaders local server running at:"
	@echo "   $(URL)"
	@echo " Press Ctrl+C to stop the server"
	@echo "========================================================"
	@echo ""
	@python3 -m http.server $(PORT) --directory $(ROOT_DIR)

server: serve

open:
	@echo ""
	@echo "Opening $(URL) in your browser..."
	@echo ""
	@(sleep 1 && open "$(URL)") &
	@python3 -m http.server $(PORT) --directory $(ROOT_DIR)
