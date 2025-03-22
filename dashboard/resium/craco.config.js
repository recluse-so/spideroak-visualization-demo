const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  webpack: {
    plugins: {
      add: [
        // Copy Cesium Assets, Widgets, and Workers to the build directory
        new CopyWebpackPlugin({
          patterns: [
            {
              from: 'node_modules/cesium/Build/Cesium/Workers',
              to: 'cesium/Workers'
            },
            {
              from: 'node_modules/cesium/Build/Cesium/ThirdParty',
              to: 'cesium/ThirdParty'
            },
            {
              from: 'node_modules/cesium/Build/Cesium/Assets',
              to: 'cesium/Assets'
            },
            {
              from: 'node_modules/cesium/Build/Cesium/Widgets',
              to: 'cesium/Widgets'
            }
          ]
        })
      ]
    },
    configure: (webpackConfig) => {
      // Configure webpack to handle .glsl, .czml, and other Cesium-specific file types
      webpackConfig.module.rules.push({
        test: /\.glsl$/,
        loader: 'raw-loader'
      });

      // Set global Cesium base URL
      webpackConfig.plugins.push(
        new webpack.DefinePlugin({
          CESIUM_BASE_URL: JSON.stringify('/cesium')
        })
      );

      return webpackConfig;
    }
  }
};