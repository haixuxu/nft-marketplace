const webpack = require('webpack');
const rewiredEsbuild = require("react-app-rewired-esbuild");

module.exports = (config,env) => {
  config.plugins.push(new webpack.ProvidePlugin({ Buffer: ['buffer', 'Buffer'] }));
  return rewiredEsbuild()({
    ...config,
    ignoreWarnings: [/Failed to parse source map/]
  }, env);
};
