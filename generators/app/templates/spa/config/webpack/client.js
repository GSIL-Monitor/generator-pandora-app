/**
 * Copyright (c) 2009-2018 pandolajs.com, All rights reserved.
 * @fileoverview generator-react-koa init
 * @author sizhao | sizhao@pandolajs.com
 * @version 1.0 | 2018-1-18 | sizhao       // 初始版本
 */

import path from 'path'
import webpack from 'webpack'
import AssetsPlugin from 'assets-webpack-plugin'
import WebpackPluginHashOutput from 'webpack-plugin-hash-output'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import baseConfig, { env, isDebug, isVerbose, isAnalyze, srcPath, destPath, pkg } from './base'

const clientBabelOptions = {
  cacheDirectory: isDebug,        // babel-loader 特有配置，默认 false, 如果设置为 true, 将会把 babel-loader 的结果缓存到 node_modules/.cache 中，避免 babel 重复编译。
  babelrc: false,                 // 禁用 .babelrc 配置文件或者 package.json 中的 babel 配置。
  presets: [
    ['env', {
      targets: {
        browsers: pkg.browserslist   // 转义需要兼容的浏览器列表
      },
      modules: false,                // modules 用来对 ES Module 的转义，false 则进制转义，由 webpack 进行。
      useBuiltIns: false,            // 是否使用 babel-polyfill
      debug: false                   // 是否输出所使用的 target/plugins
    }],
    'stage-2',
    'react'
  ],
  plugins: [
    'transform-decorators-legacy',
    ...isDebug ? [
      'transform-react-jsx-source',    // 为 jsx 元素添加源码进源码行号
      'transform-react-jsx-self'       // 为 jsx 元素添加 __self 属性，react 用来生成运行时 warning
    ] : [],
  ]
}

let { module: { rules } } = baseConfig
rules = rules.map(rule => {
  return rule.loader === 'babel-loader' ? {
    ...rule,
    options: clientBabelOptions
  } : rule
})

export default {
  ...baseConfig,
  name: 'client',
  target: 'web',

  entry: {
    client: ['babel-polyfill', path.resolve(srcPath, 'client/index.js')]
  },

  output: {
    ...baseConfig.output,
    filename: isDebug ? '[name].js' : '[name].[chunkhash:22].js',
    chunkFilename: isDebug ? '[name].chunk.js' : '[name].[chunkhash:22].chunk.js'
  },

  resolve: {
    ...baseConfig.resolve,
    mainFields: isDebug ? ['module', 'browser', 'main'] : ['browser', 'main']
  },

  module: {
    ...baseConfig.module,
    rules
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env),
      'process.env.BROWSER': true,
      __DEV__: isDebug
    }),

    new AssetsPlugin({
      path: destPath,
      filename: 'assets.json',
      prettyPrint: true
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: module => /node_modules/.test(module.resource)
    }),

    ...isDebug ? [] : [
      new WebpackPluginHashOutput(),

      new webpack.optimize.UglifyJsPlugin({
        parallel: true,      // 并行处理
        sourceMap: true,
        uglifyOptions: {
          ie8: false,
          compress: {
            warnings: isVerbose,
            unused: true,
            dead_code: true,
            drop_console: true
          },
          output: {
            beautify: false,
            comments: false
          }
        }
      }),

      ...isAnalyze ? [new BundleAnalyzerPlugin()] : []
    ]
  ],

  devtool: isDebug ? 'cheap-module-source-map' : false,

  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
}
