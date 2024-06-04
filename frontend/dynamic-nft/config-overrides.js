const webpack = require('webpack');

module.exports = (config) => {
  config.plugins.push(new webpack.ProvidePlugin({ Buffer: ['buffer', 'Buffer'] }));
  return {
    ...config,
    ignoreWarnings: [/Failed to parse source map/]
  }
};
