'use strict';

const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const Visualizer = require('webpack-visualizer-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

function getPlugins() {
  let plugins = [];
  
  plugins.push(
    // Ensure all libraries are able to access the node environment variable.  The variable needs to be set in
    // package.json.
    new webpack.EnvironmentPlugin(['NODE_ENV'])
  );

  // Provides a sunburst chart that makes it easier to perform a quick high level overview.
  plugins.push(
    new Visualizer({
      filename: '../temp/visualizer.html'
    })
  );

  // Provides a map that makes it easier to perform a detailed inspection.
  plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: '../temp/bundle-analyzer.html',
      openAnalyzer: false
    })
  );  

  return plugins;
}

module.exports = function (env) {
  return (
    {
      entry: { 
        'web-data-store': path.resolve(__dirname, 'src/index')
      },
      output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        library: 'webDataStore',
        libraryTarget: 'umd',
        umdNamedDefine: true
      },
      resolve: {
        extensions: ['.ts', '.tsx', '.js']
      },    
      target: 'web',
      devtool: 'source-map',
      module: {
        rules: [
            {
              test: /\.tsx?$/,
              loader: 'ts-loader',
              options: {
                "compilerOptions": {
                  "outDir": "../lib/" // ts-loader seems to have a bug where it uses the output folder as the root folder when generating type definitions, so you need to move up to get to the proper root folder.
                }
              }
            }
        ]
      },
      plugins: getPlugins()
    }
  );
};