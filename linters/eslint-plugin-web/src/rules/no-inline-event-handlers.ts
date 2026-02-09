import { Rule } from "eslint";

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow inline event handlers",
      category: "Best Practices",
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      // JSX Support
      JSXAttribute(node: any) {
        if (node.name.type === "JSXIdentifier" && /^on[A-Z]/.test(node.name.name)) {
          context.report({
            node,
            message: `Avoid inline event handler '${node.name.name}'.`,
          });
        }
      },
      // HTML Support
      Attribute(node: any) {
        if (node.name.toLowerCase().startsWith("on")) {
          context.report({
            node,
            message: `Avoid inline event handler '${node.name}'.`,
          });
        }
      },
    };
  },
};

export default rule;
