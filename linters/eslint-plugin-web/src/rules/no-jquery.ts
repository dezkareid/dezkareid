import type { Rule } from 'eslint';

const noJquery: Rule.RuleModule = {
  meta: {
    type: 'problem',
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        if (node.source.value === 'jquery') {
          context.report({
            node,
            message: 'jquery should not be used ever again',
          });
        }
      },
    };
  },
};

export default noJquery;
