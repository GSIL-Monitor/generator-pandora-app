/**
 * Copyright (c) 2009-2018 pandolajs.com, All rights reserved.
 * @fileoverview generator-react-koa init
 * @author sizhao | sizhao@pandolajs.com
 * @version 1.0 | 2018-1-18 | sizhao       // 初始版本
 */
import cp from 'child_process'
import run from './run'
import clean from './clean'
import copy from './copy'
import bundle from './bundle'
import pkg from '../package.json'

/**
 * Compiles the project from source files into a distributable
 * format and copies it to the output (build) folder.
 */
async function build() {
  await run(clean)
  await run(copy)
  await run(bundle)

  if (process.argv.includes('--docker')) {
    cp.spawnSync('docker', ['build', '-t', pkg.name, '.'], {
      stdio: 'inherit'
    })
  }
}

export default build