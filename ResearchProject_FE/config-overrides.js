// config-overrides.js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = function override(config, env) {
  config.entry = {
    main: path.resolve(__dirname, 'src/index.js'),
    second: path.resolve(__dirname, 'src/second.js'),
  };

  config.plugins.push(
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['second'],
      template: path.resolve(__dirname, 'public/second.html'),
      filename: 'second.html',
    })
  );

  return config;
};
