/**
 * Copyright (c) 2009-2018 pandolajs.com, All rights reserved.
 * @fileoverview generator-react-koa init
 * @author sizhao | sizhao@pandolajs.com
 * @version 1.0 | 2018-1-18 | sizhao       // 初始版本
 */
import path from 'path'
import chokidar from 'chokidar'
import {
  writeFile,
  copyFile,
  makeDir,
  copyDir,
  cleanDir
} from './lib/fs'
import pkg from '../package.json'
import processJson from '../process.json'
import {
  format
} from './run'

/**
 * Copies static files such as robots.txt, favicon.ico to the
 * output (build) folder.
 */
async function copy() {
  await makeDir('build')
  await Promise.all([
    writeFile('build/process.json', JSON.stringify(processJson, null, 2)),
    writeFile('build/package.json', JSON.stringify({
      private: true,
      engines: pkg.engines,
      dependencies: pkg.dependencies,
      scripts: {
        start: 'node server.js'
      }
    }, null, 2)),
    copyDir('public', 'build/public')
  ])

  if (process.argv.includes('--watch')) {
    const watcher = chokidar.watch([
      'public/**/*'
    ], {
      ignoreInitial: true
    })

    watcher.on('all', async (event, filePath) => {
      const start = new Date()
      const src = path.relative('./', filePath)
      const dist = path.join('build/', src.startsWith('src') ? path.relative('src', src) : src)
      switch (event) {
        case 'add':
        case 'change':
          await makeDir(path.dirname(dist))
          await copyFile(filePath, dist)
          break
        case 'unlink':
        case 'unlinkDir':
          cleanDir(dist, {
            nosort: true,
            dot: true
          })
          break
        default:
          return
      }
      const end = new Date()
      const time = end.getTime() - start.getTime()
      console.log(`[${format(end)}] ${event} '${dist}' after ${time} ms`)
    })
  }
}

export default copy