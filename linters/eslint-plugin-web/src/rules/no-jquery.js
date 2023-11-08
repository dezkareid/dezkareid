module.exports = {
  meta: {
    type: "problem"
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        if (node.source.value === "jquery") {
          context.report({
            node: node,
            message: "jquery should not be used ever again"
          });
        }
      }
    };
  }
}