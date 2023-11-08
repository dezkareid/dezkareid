module.exports = {
  meta: {
    type: "problem",
    schema: {
      type: "array",
      minItems: 0,
    }
  },
  create(context) {
    const forbiddenPackages = new Set(context.options);
    return {
      ImportDeclaration(node) {
        const packageName = node.source.value
        if (forbiddenPackages.has(packageName)) {
          context.report({
            node: node,
            message: `${packageName} should not be used ever again`
          });
        }
      }
    }
  }
}