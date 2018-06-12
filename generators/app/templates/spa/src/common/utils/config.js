/**
 * Copyright (c) 2009-2018 pandolajs.com, All rights reserved.
 * @fileoverview config for nodejs
 * @author sizhao | sizhao@pandolajs.com
 * @version 1.0 | 2018-1-18 | sizhao       // 初始版本
 */

import path from 'path'
import fs from 'fs'
import yaml from 'js-yaml'

if (process.env.BROWSER) {
  throw new Error('Do not import `config.js` from inside the client-side code.')
}

const root = path.join(__dirname, '..')
const appConfigPath = path.resolve(root, 'config/app.yaml')
const appConfig = yaml.safeLoad(fs.readFileSync(appConfigPath))

export default appConfig
