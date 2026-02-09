import { Rule } from "eslint";

const rule: Rule.RuleModule = {
  meta: {
    type: "problem"
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        if (node.source.value === "jquery") {
          context.report({
            node,
            message: "jquery should not be used ever again"
          });
        }
      }
    };
  }
};

export default rule;
