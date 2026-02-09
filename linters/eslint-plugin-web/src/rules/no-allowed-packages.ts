import { Rule } from "eslint";

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    schema: {
      type: "array",
      items: { type: "string" },
      minItems: 0,
    }
  },
  create(context) {
    const forbiddenPackages = new Set<string>(context.options);
    return {
      ImportDeclaration(node) {
        const packageName = node.source.value;
        if (typeof packageName === "string" && forbiddenPackages.has(packageName)) {
          context.report({
            node,
            message: `${packageName} should not be used ever again`
          });
        }
      }
    };
  }
};

export default rule;
