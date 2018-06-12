/**
 * Copyright (c) 2009-2018 pandolajs.com, All rights reserved.
 * @fileoverview redux logger middleware for client
 * @author sizhao | sizhao@pandolajs.com
 * @version 1.0 | 2018-1-18 | sizhao       // 初始版本
 */

import { createLogger as reduxLogger } from 'redux-logger'

export default function createLogger () {
  return reduxLogger({
    collapsed: true
  })
}
