import postcss from "postcss";
// Storybook-only aliases for native pseudo selectors; declarations stay shared.
export function storyStates() {
  return {
    postcssPlugin: "storybook-visible-states",
    OnceExit(root) {
      root.walkRules((rule) => {
        if (rule.selector.includes("data-story-state")) return;
        const selector = rule.selector
          .replace(/(?<!\\):hover\b/g, ':where([data-story-state="hovered"] *)')
          .replace(/(?<!\\):focus-visible\b/g, ':where([data-story-state="focused"] *)');
        if (selector !== rule.selector) rule.cloneAfter({ selector });
      });
    },
  };
}

export function storyStatesVite() {
  return {
    name: "storybook-visible-states",
    enforce: "pre",
    async transform(code, id) {
      if (!id.split("?")[0].endsWith(".css")) return;
      const result = await postcss([storyStates()]).process(code, { from: id, map: false });
      return { code: result.css, map: null };
    },
  };
}
