const importPlugin = require('postcss-import');
const cssNano = require('cssnano');

const { scopeWebComponentSelectors } = require('./src/web-components/scopedStyles');

module.exports = context => {
  const plugins = [importPlugin()];

  if (context.env === 'scoped-web-components') {
    plugins.push(scopeWebComponentSelectors());
  }

  plugins.push(cssNano({ preset: 'default' }));

  return {
    plugins,
  };
};
