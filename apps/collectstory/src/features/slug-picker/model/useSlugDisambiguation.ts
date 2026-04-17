'use client';

import { useState, useCallback } from 'react';
import type { SlugOption } from '@/app/[locale]/[username]/[collectionSlug]/actions';
import { checkSlugCollision } from '@/app/[locale]/[username]/[collectionSlug]/actions';

export type SlugDisambiguationState = {
  slugOptions: SlugOption[] | null;
  selectedSlug: string | null;
  needsSelection: boolean;
  /** Returns the options if a collision was detected, or null if the base slug is free. */
  checkCollision: (
    name: string,
    collectionId: string,
    lineName?: string,
    variant?: string,
    brandName?: string,
  ) => Promise<SlugOption[] | null>;
  selectSlug: (slug: string) => void;
  reset: () => void;
};

export function useSlugDisambiguation(): SlugDisambiguationState {
  const [slugOptions, setSlugOptions] = useState<SlugOption[] | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const checkCollision = useCallback(async (
    name: string,
    collectionId: string,
    lineName?: string,
    variant?: string,
    brandName?: string,
  ): Promise<SlugOption[] | null> => {
    const options = await checkSlugCollision(collectionId, name, lineName, variant, brandName);
    setSlugOptions(options);
    setSelectedSlug(null);
    return options;
  }, []);

  const selectSlug = useCallback((slug: string) => {
    setSelectedSlug(slug);
  }, []);

  const reset = useCallback(() => {
    setSlugOptions(null);
    setSelectedSlug(null);
  }, []);

  const needsSelection = slugOptions !== null && selectedSlug === null;

  return { slugOptions, selectedSlug, needsSelection, checkCollision, selectSlug, reset };
}

export { type SlugOption } from '@/app/[locale]/[username]/[collectionSlug]/actions';
