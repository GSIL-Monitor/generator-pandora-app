/**
 * Copyright (c) 2009-2018 pandolajs.com, All rights reserved.
 * @fileoverview generator-react-koa init
 * @author sizhao | sizhao@pandolajs.com
 * @version 1.0 | 2018-1-18 | sizhao       // 初始版本
 */
import browserSync from 'browser-sync'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import WriteFilePlugin from 'write-file-webpack-plugin'
import run from './run'
import runServer from './runServer'
import webpackConfig from '../config/webpack.config'
import clean from './clean'
import copy from './copy'

const isDebug = !process.argv.includes('--release')
process.argv.push('--watch')

const [clientConfig, serverConfig] = webpackConfig

/**
 * Launches a development web server with "live reload" functionality -
 * synchronizing URLs, interactions and code changes across multiple devices.
 */
async function start() {
  await run(clean)
  await run(copy)
  await new Promise((resolve) => {
    // Save the server-side bundle files to the file system after compilation
    // https://github.com/webpack/webpack-dev-server/issues/62
    serverConfig.plugins.push(new WriteFilePlugin({
      log: false
    }))

    // Hot Module Replacement (HMR) + React Hot Reload
    if (isDebug) {
      clientConfig.entry.client = [...new Set([
        'babel-polyfill',
        'react-hot-loader/patch',
        'webpack-hot-middleware/client'
      ].concat(clientConfig.entry.client))]
      clientConfig.output.filename = clientConfig.output.filename.replace('[chunkhash', '[hash')
      clientConfig.output.chunkFilename = clientConfig.output.chunkFilename.replace('[chunkhash', '[hash')
      const {
        options
      } = clientConfig.module.rules.find(x => x.loader === 'babel-loader')
      options.plugins = ['react-hot-loader/babel'].concat(options.plugins || [])
      clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
      clientConfig.plugins.push(new webpack.NoEmitOnErrorsPlugin())
    }

    const bundler = webpack(webpackConfig)
    const wpMiddleware = webpackDevMiddleware(bundler, {
      // IMPORTANT: webpack middleware can't access config,
      // so we should provide publicPath by ourselves
      publicPath: clientConfig.output.publicPath,

      // Pretty colored output
      stats: clientConfig.stats

      // For other settings see
      // https://webpack.github.io/docs/webpack-dev-middleware
    })
    const hotMiddleware = webpackHotMiddleware(bundler.compilers[0])

    let handleBundleComplete = async () => {
      handleBundleComplete = stats => !stats.stats[1].compilation.errors.length && runServer()

      const server = await runServer()
      const bs = browserSync.create()

      bs.init({
        // modified by sizhao @2017-06-26 开发环境下 bs 的提醒非常鸡肋
        ...{
          notify: false,
          ui: false
        },

        proxy: {
          target: server.host,
          middleware: [wpMiddleware, hotMiddleware],
          proxyOptions: {
            xfwd: true
          }
        }
      }, resolve)
    }

    bundler.plugin('done', stats => handleBundleComplete(stats))
  })
}

export default start
