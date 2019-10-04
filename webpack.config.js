const GasPlugin = require('gas-webpack-plugin');
const es3ifyPlugin = require('es3ify-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  devtool: 'inline-source-map',
  entry: './src/index.ts',
  output: {
    filename: 'bundle.js',
    path: `${__dirname}/dist`,
  },
  resolve: {
    extensions: ['.ts','.mjs', '.js'],
  },
  module: {
    rules: [
      { test: /\.ts?$/, loader: 'awesome-typescript-loader' },
    ],
  },
  plugins: [
    new GasPlugin(),
    new es3ifyPlugin(),
   // new BundleAnalyzerPlugin(),
  ],
  optimization: {
    providedExports: true,
    usedExports: true,
    sideEffects: true,
    minimizer: [new UglifyJsPlugin({uglifyOptions:{  
      ie8: true,
      output: {
        max_line_len: 255,
      },
      mangle: true,
      keep_fnames: true
    }})],
    minimize: true,
  }
};
