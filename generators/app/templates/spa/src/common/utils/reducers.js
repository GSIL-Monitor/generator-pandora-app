/**
 * Copyright (c) 2009-2017 pandolajs.com, All rights reserved.
 * @fileoverview redux reducers
 * @author sizhao | sizhao@pandolajs.com
 * @version 1.0 | 2017-07-12 | sizhao       // 初始版本
 */

import { combineReducers } from 'redux'

const req = require.context('../../client/reducers', true, /^\.\/[\w-]+\.js$/)

let modules = {}
req.keys().forEach(mod => {
  const name = mod.match(/^\.\/([\w-]+)\.js$/)[1]
  const reducer = req(mod).default
  modules[name] = reducer
})

export default combineReducers(modules)
