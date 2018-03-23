'use strict';

const path = require('path');
const webpack = require('webpack');

function getPlugins() {
  let plugins = [];
  
  plugins.push(
    // Ensure all libraries are able to access the node environment variable.  The variable needs to be set in
    // package.json.
    new webpack.EnvironmentPlugin(['NODE_ENV'])
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