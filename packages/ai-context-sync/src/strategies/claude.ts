import { SymlinkStrategy } from './symlink.js';

export class ClaudeStrategy extends SymlinkStrategy {
  name = 'claude';
  targetFilename = 'CLAUDE.md';
}
