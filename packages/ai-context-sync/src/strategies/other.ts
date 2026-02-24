import { SymlinkStrategy } from './symlink.js';

export class OtherStrategy extends SymlinkStrategy {
  name = 'other';
  targetFilename: string;

  constructor(targetFilename: string, fromFile?: string) {
    super(fromFile);
    this.targetFilename = targetFilename;
  }
}
