/**
 * Copyright (c) 2009-2018 pandolajs.com, All rights reserved.
 * @fileoverview generator-react-koa init
 * @author sizhao | sizhao@pandolajs.com
 * @version 1.0 | 2018-1-18 | sizhao       // 初始版本
 */

import path from 'path'
import baseConfig, { env, isDebug, isVerbose, isAnalyze, srcPath, destPath, pkg } from './base'
import nodeExternals from 'webpack-node-externals'
import webpack from 'webpack'

// server 端 bebel-loader options 配置
const serverBabelOptions = {
  cacheDirectory: isDebug,        // babel-loader 特有配置，默认 false, 如果设置为 true, 将会把 babel-loader 的结果缓存到 node_modules/.cache 中，避免 babel 重复编译。
  babelrc: false,                 // 禁用 .babelrc 配置文件或者 package.json 中的 babel 配置。
  presets: [
    ['env', {
      targets: {
        node: `${parseFloat(pkg.engines.node.replace(/^\D+/g, ''))}`  // 必须为字符串，否则 babel 编译的时候会有 warnning
      },
      modules: false,         // modules 用来对 ES Module 的转义，false 则进制转义，由 webpack 进行。
      useBuiltIns: false,     // 是否使用 babel-polyfill
      debug: false            // 是否输出所使用的 target/plugins
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
    options: serverBabelOptions
  } : rule
})

export default {
  ...baseConfig,
  name: 'server',
  target: 'node',

  entry: {
    server: ['babel-polyfill', path.resolve(srcPath, 'server/index.js')]
  },

  output: {
    ...baseConfig.output,
    filename: '../../server.js',
    libraryTarget: 'commonjs2'
  },

  resolve: {
    ...baseConfig.resolve,
    mainFields: isDebug ? ['module', 'main'] : ['main']
  },

  module: {
    ...baseConfig.module,
    rules
  },

  externals: [
    /^\.\/assets\.json$/,
    nodeExternals({
      whitelist: [/\.(?!(?:jsx?|json)$).{1,5}$/i]  // 对于 node_modules 中的 css, less 等依旧打包
    })
  ],

  plugins: [
    // 定义全局变量
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env),
      'process.env.BROWSER': false,
      __DEV__: isDebug
    }),

    // 在 node 端不需要按需加载，除了 entry.server bundler 不再生成额外的 chunk.
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }),

    // 为所有的 chunk 顶部添加额外的内容
    new webpack.BannerPlugin({
      banner: 'require("source-map-support").install()',
      raw: true,          // 原文输出
      entryOnly: false    // 所有的 chunk 都添加，其实这里设置与 true 也是可以的，因为 LimitChunkCountPlugin 已经设置为只有一个 chunk.
    })
  ],

  node: {
    console: false,
    global: false,
    process: false,
    __filename: false,
    __dirname: false,
    Buffer: false,
    setImmediate: false
  },

  devtool: isDebug ? 'cheap-module-source-map' : 'source-map'
}
