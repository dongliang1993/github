/**
 * next的一些配置项：
 *  配置css、less等
 */
const webpack = require('webpack');
const withCss = require('@zeit/next-css');
const withAnalyze = require('@zeit/next-bundle-analyzer');
const {github} = require('./config');
if (typeof require !== 'undefined') {
  require.extensions['.css'] = file => {
  }
}
const {auth_url: GITHUB_OAUTH_URL, scope: SCOPE} = github;
module.exports = withAnalyze(withCss({
  env: {
    customKey: 'Value'
  },
  // 在客户端渲染拿到的serverRuntimeConfig是个空对象
  serverRuntimeConfig: {
    mySecret: 'secret',
    secondSecret: process.env.SECOND_SECRET
  },
  // 在服务端渲染和客户端渲染均能够获取的配置
  publicRuntimeConfig: {
    // staticFolder: '/static'
    GITHUB_OAUTH_URL,
    OAUTH_URL:`${GITHUB_OAUTH_URL}?client_id=${github.client_id}&scope=${SCOPE}`
  },
  analyzeServer: ['server', 'both'].includes(process.env.BUNDLE_ANALYZE),
  analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
  bundleAnalyzerConfig: {
    server: {
      analyzerMode: 'static',
      reportFilename: '../bundles/server.html'
    },
    browser: {
      analyzerMode: 'static',
      reportFilename: '../bundles/client.html'
    }
  },
  // webpack的配置：配置按需加载antd
  webpack: (config, { isServer }) => {
    if (isServer) {
      const antStyles = /antd\/.*?\/style\/css.*?/;
      const origExternals = [...config.externals];
      config.externals = [
        (context, request, callback) => {
          if (request.match(antStyles)) return callback();
          if (typeof origExternals[0] === 'function') {
            origExternals[0](context, request, callback)
          } else {
            callback()
          }
        },
        ...(typeof origExternals[0] === 'function' ? [] : origExternals),
      ];

      config.module.rules.unshift({
        test: antStyles,
      })
    }
    config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));
    return config
  }
}));
