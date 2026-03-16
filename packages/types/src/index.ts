/**
 * @dezkareid/types
 * A collection of types for APIs, structured data and shared types.
 */

export type ID = string | number;

export interface Timestamps {
  createdAt: string;
  updatedAt: string;
}

export * from './speculation-rules.js';
