import { useEffect } from "react";
import { SpeculationRule, addSpeculationRulesScript } from "./utilities";

export const useSpeculationRules = (speculationRules: SpeculationRule) => {
  useEffect(() => {
    addSpeculationRulesScript(speculationRules);
  }, [speculationRules]);
}