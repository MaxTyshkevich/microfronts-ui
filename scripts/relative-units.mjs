export function relativeUnits() {
  const relative = (value) => value.replace(/(-?\d*\.?\d+)px\b/g, (_, n) => Number(n) / 16 + "rem");
  return {
    postcssPlugin: "ui-relative-units",
    Declaration(decl) {
      decl.value = relative(decl.value);
    },
    AtRule: {
      media(rule) {
        rule.params = relative(rule.params);
      },
    },
  };
}
