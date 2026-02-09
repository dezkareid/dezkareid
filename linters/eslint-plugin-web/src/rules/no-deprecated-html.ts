import { Rule } from "eslint";

const DEPRECATED_TAGS = new Set(["center", "font", "big", "strike", "tt"]);

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow deprecated HTML elements",
      category: "Possible Errors",
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      // JSX Support
      JSXOpeningElement(node: any) {
        if (node.name.type === "JSXIdentifier" && DEPRECATED_TAGS.has(node.name.name.toLowerCase())) {
          context.report({
            node,
            message: `The <${node.name.name}> element is deprecated.`,
          });
        }
      },
      // HTML Support (via @html-eslint/parser)
      Tag(node: any) {
        if (DEPRECATED_TAGS.has(node.name.toLowerCase())) {
          context.report({
            node,
            message: `The <${node.name}> element is deprecated.`,
          });
        }
      },
    };
  },
};

export default rule;
