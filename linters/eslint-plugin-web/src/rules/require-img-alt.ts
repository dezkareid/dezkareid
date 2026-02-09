import { Rule } from "eslint";

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "Require alt attribute on images",
      category: "Best Practices",
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      // JSX Support
      JSXOpeningElement(node: any) {
        if (node.name.type === "JSXIdentifier" && node.name.name.toLowerCase() === "img") {
          const altAttr = node.attributes.find(
            (attr: any) => attr.type === "JSXAttribute" && attr.name.name === "alt"
          );
          if (!altAttr) {
            context.report({
              node,
              message: "<img> elements must have an alt attribute.",
            });
          } else if (
            altAttr.value &&
            altAttr.value.type === "Literal" &&
            altAttr.value.value === ""
          ) {
            // Per CONTEXT: alt="" MUST still trigger a warning
            context.report({
              node: altAttr,
              message: "Decorative images (alt="") should still be explicitly described or verified.",
            });
          }
        }
      },
      // HTML Support
      Tag(node: any) {
        if (node.name.toLowerCase() === "img") {
          const altAttr = node.attributes.find((attr: any) => attr.name.toLowerCase() === "alt");
          if (!altAttr) {
            context.report({
              node,
              message: "<img> elements must have an alt attribute.",
            });
          } else if (altAttr.value === "") {
            context.report({
              node: altAttr,
              message: "Decorative images (alt="") should still be explicitly described or verified.",
            });
          }
        }
      },
    };
  },
};

export default rule;
