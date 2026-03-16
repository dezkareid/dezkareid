export interface SpeculationRuleWhere {
  href_matches: string;
}

export interface SpeculationRulePrerender {
  where: SpeculationRuleWhere;
  eagerness: 'immediate' | 'moderate' | 'conservative';
}

export interface SpeculationRule {
  prerender: SpeculationRulePrerender[];
};

export const SPECULATION_RULES_SCRIPT_TYPE = 'speculationrules';

export const getAppDocument = () => {
  if (typeof document === 'undefined') {
    return;
  }
  return document;
};

export const hasSpeculationRulesSupport = () => {
  return HTMLScriptElement.supports?.(SPECULATION_RULES_SCRIPT_TYPE);
};

export const createSpeculationRulesScript = () => {
  const appDocument = getAppDocument();
  const script = appDocument?.createElement?.(SPECULATION_RULES_SCRIPT_TYPE);
  return script;
};

export const addSpeculationRulesScript = (speculationRules: SpeculationRule) => {
  const appDocument = getAppDocument();
  const script = createSpeculationRulesScript();
  if (!script) {
    return;
  }
  script.textContent = JSON.stringify(speculationRules);
  appDocument?.head?.appendChild?.(script);
};
