# Load .env.local if it exists (for local overrides)
-include .env.local
export

.PHONY: claude
claude:
	claude
gemini:
	gemini