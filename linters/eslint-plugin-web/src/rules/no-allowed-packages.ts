import type { Rule } from 'eslint';

const noAllowedPackages: Rule.RuleModule = {
  meta: {
    type: 'problem',
    schema: {
      type: 'array',
      minItems: 0,
    },
  },
  create(context) {
    const forbiddenPackages = new Set(context.options as string[]);
    return {
      ImportDeclaration(node) {
        const packageName = node.source.value as string;
        if (forbiddenPackages.has(packageName)) {
          context.report({
            node,
            message: `${packageName} should not be used ever again`,
          });
        }
      },
    };
  },
};

export default noAllowedPackages;
