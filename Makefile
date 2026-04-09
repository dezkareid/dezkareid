# Load .env.local if it exists (for local overrides)
-include .env.local
export

.PHONY: claude gemini claude-worktree gemini-worktree

claude:
	claude

gemini:
	gemini

claude-worktree:
	@test -n "$(feature)" || (echo "Usage: make claude-worktree feature=<feature-name>" && exit 1)
	claude --worktree $(feature)

gemini-worktree:
	@test -n "$(feature)" || (echo "Usage: make gemini-worktree feature=<feature-name>" && exit 1)
	gemini --worktree $(feature)
