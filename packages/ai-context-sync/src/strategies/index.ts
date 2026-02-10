import { AGENTS_FILENAME } from '../constants.js';

export interface SyncStrategy {
  name: string;
  sync(context: string, projectRoot: string): Promise<void>;
}

export const AGENTS_FILE = AGENTS_FILENAME;
