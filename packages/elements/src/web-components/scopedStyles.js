const DEFAULT_SCOPE_SELECTOR = ':where(.stoplight)';
const LEADING_GLOBAL_SELECTOR = /^(html|body)(?=$|[\s>+~.#[:])/;
const LEADING_DATA_THEME_SELECTOR = /^\[data-theme=([^\]]+)\](.*)$/;

function appendToScopeSelector(scopeSelector, suffix) {
  if (scopeSelector.endsWith(')')) {
    return `${scopeSelector.slice(0, -1)}${suffix})`;
  }

  return `${scopeSelector}${suffix}`;
}

function transformSelector(selector, scopeSelector = DEFAULT_SCOPE_SELECTOR) {
  const trimmedSelector = selector.trim();

  if (!trimmedSelector) {
    return null;
  }

  if (LEADING_GLOBAL_SELECTOR.test(trimmedSelector)) {
    return null;
  }

  if (trimmedSelector.startsWith(':root')) {
    return `${scopeSelector}${trimmedSelector.slice(':root'.length)}`;
  }

  const dataThemeMatch = trimmedSelector.match(LEADING_DATA_THEME_SELECTOR);

  if (dataThemeMatch) {
    return `${appendToScopeSelector(scopeSelector, `[data-theme=${dataThemeMatch[1]}]`)}${dataThemeMatch[2]}`;
  }

  return `${scopeSelector} ${trimmedSelector}`;
}

function scopeWebComponentSelectors(options = {}) {
  const scopeSelector = options.scopeSelector || DEFAULT_SCOPE_SELECTOR;

  return {
    postcssPlugin: 'scope-web-component-selectors',
    Rule(rule) {
      if (!rule.selectors) {
        return;
      }

      const scopedSelectors = rule.selectors
        .map(selector => transformSelector(selector, scopeSelector))
        .filter(Boolean);

      if (scopedSelectors.length === 0) {
        rule.remove();
        return;
      }

      rule.selectors = scopedSelectors;
    },
  };
}

scopeWebComponentSelectors.postcss = true;

module.exports = {
  DEFAULT_SCOPE_SELECTOR,
  scopeWebComponentSelectors,
  transformSelector,
};
