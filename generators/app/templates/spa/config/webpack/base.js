/**
 * Copyright (c) 2009-2018 pandolajs.com, All rights reserved.
 * @fileoverview webpack-base configuration
 * @author sizhao | sizhao@pandolajs.com
 * @version 1.0 | 2018-1-18 | sizhao       // 初始版本
 */

import path from 'path'
import webpack from 'webpack'
import AssetsPlugin from 'assets-webpack-plugin'
import WebpackPluginHashOutput from 'webpack-plugin-hash-output'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import pkg from '../../package'

// 环境变量
const DEFAULT_ENV = 'development'
const NODE_ENV = process.env.NODE_ENV
const env = /(?:development|test|staging|production)/i.test(NODE_ENV) ? NODE_ENV : DEFAULT_ENV
const isDebug = env === DEFAULT_ENV
const isVerbose = process.argv.includes('--verbose')
const isAnalyze = process.argv.includes('--analyze')

// 静态文件目录
let publicPath = '/assets/'
if(/(?:test|staging)/i.test(env)){
  publicPath = `//test.wacdn.com/s/${pkg.name}`
}else if(env === 'production'){
  publicPath = `//s1.wacdn.com/s/${pkg.name}`
}

const contextPath = path.resolve(__dirname, '../..')
const srcPath = path.resolve(contextPath, 'src')
const destPath = path.resolve(contextPath, 'build')

const alias = {
  Client: path.resolve(srcPath, 'client'),
  Server: path.resolve(srcPath, 'server'),
  Common: path.resolve(srcPath, 'common'),
  Component: path.resolve(srcPath, 'client/components'),
  Page: path.resolve(srcPath, 'client/pages'),
  Util: path.resolve(srcPath, 'common/utils'),
  '@wac/wac-ui-mob': path.resolve(srcPath, 'common/components')
}

export { env, isDebug, isVerbose, isAnalyze, srcPath, destPath, pkg }

// webpack client 和 server 通用配置
export default {
  context: contextPath,

  output: {
    path: path.resolve(destPath, 'public/assets'),
    publicPath,
    pathinfo: isVerbose
  },

  resolve: {
    alias
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          srcPath,
          ...isDebug ? [/node_modules\/@wac\/(?:wac-ui-mob|isomorphic-router)/] : []
        ]
      },
      {
        test: /\.(css|less)$/,
        use: [
          {
            loader: 'isomorphic-style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 4,
              sourceMap: isDebug,
              camelCase: true,
              modules: true,
              localIdentName: isDebug ? '[name]-[local]-[hash:base64:5]' : '[hash:base64:5]',
              minimize: !isDebug,
              discardComments: {
                removeAll: true
              }
            }
          },
          {
            loader: 'resolve-url-loader'
          },
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: './config/postcss.config'
              },
              sourceMap: true
            }
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: true,
              relativeUrls: false
            }
          },
          {
            loader: '@wac/wac-less-loader'
          }
        ]
      },
      {
        test: /\.md$/,
        loader: path.resolve(__dirname, '../scripts/lib/markdown-loader.js')
      },
      {
        test: /\.txt$/,
        loader: 'raw-loader'
      },
      {
        test: /\.(ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|ico|jpg|jpeg|png|gif|eot|otf|webp|svg)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          name: isDebug ? '[path][name].[ext]?[hash:8]' : '[hash:8].[ext]'
        }
      }
    ]
  },

  bail: !isDebug,
  cache: false,
  stats: {
    colors: true,
    reasons: isDebug,
    hash: isVerbose,
    version: isVerbose,
    timings: true,
    chunks: isVerbose,
    chunkModules: isVerbose,
    cached: isVerbose,
    cachedAssets: isVerbose
  }
}
