/**
 * Speculation Rules API Types
 * @see https://wicg.github.io/nav-speculation/speculation-rules.html
 */

export type SpeculationAction = 'prefetch' | 'prerender';

export type SpeculationSource = 'list' | 'document';

export type SpeculationEagerness = 'immediate' | 'eager' | 'moderate' | 'conservative';

/**
 * Standard Referrer Policies
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
 */
export type SpeculationReferrerPolicy =
  | 'no-referrer'
  | 'no-referrer-when-downgrade'
  | 'origin'
  | 'origin-when-cross-origin'
  | 'same-origin'
  | 'strict-origin'
  | 'strict-origin-when-cross-origin'
  | 'unsafe-url';

export type SpeculationTargetHint = '_self' | '_blank';

export type SpeculationRequirement = 'anonymous-client-ip-when-cross-origin';

export interface SpeculationDocumentFilter {
  href_matches?: string | string[];
  selector_matches?: string | string[];
  and?: SpeculationDocumentFilter[];
  or?: SpeculationDocumentFilter[];
  not?: SpeculationDocumentFilter;
}

export interface SpeculationRuleBase {
  /**
   * @default 'conservative'
   */
  eagerness?: SpeculationEagerness;
  referrer_policy?: SpeculationReferrerPolicy;
  /**
   * @experimental
   */
  target_hint?: SpeculationTargetHint;
  /**
   * @experimental
   */
  requires?: SpeculationRequirement[];
  /**
   * A string used to identify the rule for debugging or analytics purposes.
   */
  tag?: string;
  /**
   * @experimental
   */
  expects_no_vary_search?: string;
}

export interface SpeculationListRule extends SpeculationRuleBase {
  source: 'list';
  urls: string[];
  /**
   * @default 'document'
   */
  relative_to?: 'document' | 'ruleset';
}

export interface SpeculationDocumentRule extends SpeculationRuleBase {
  source: 'document';
  where: SpeculationDocumentFilter;
}

export type SpeculationRule = SpeculationListRule | SpeculationDocumentRule;

export interface SpeculationRules {
  prefetch?: SpeculationRule[];
  prerender?: SpeculationRule[];
}
