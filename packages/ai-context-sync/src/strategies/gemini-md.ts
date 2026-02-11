import { SymlinkStrategy } from './symlink.js';

export class GeminiMdStrategy extends SymlinkStrategy {
  name = 'gemini-md';
  targetFilename = 'GEMINI.md';
}
