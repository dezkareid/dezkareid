import { assertType, expectTypeOf, test } from 'vitest';
import { SpeculationRules, SpeculationRule } from './speculation-rules';

test('SpeculationRules type check', () => {
  assertType<SpeculationRules>({
    prefetch: [
      {
        source: 'list',
        urls: ['/page1'],
      },
    ],
  });

  assertType<SpeculationRules>({
    prerender: [
      {
        source: 'document',
        where: {
          href_matches: '/blog/*',
        },
      },
    ],
  });
});

test('SpeculationRule structure', () => {
  expectTypeOf<SpeculationRule>().toBeObject();
});

test('Experimental features', () => {
  assertType<SpeculationRule>({
    source: 'list',
    urls: ['/experimental'],
    target_hint: '_blank',
    referrer_policy: 'no-referrer',
  });
});
