/**
 * Copyright (c) 2009-2018 pandolajs.com, All rights reserved.
 * @fileoverview redux logger middleware for server
 * @author sizhao | sizhao@pandolajs.com
 * @version 1.0 | 2018-1-18 | sizhao       // 初始版本
 */

import { inspect } from 'util'

function inspectObject (object) {
  return inspect(object, {
    colors: true
  })
}

// Server side redux action logger
export default function createLogger () {
  return store => next => (action) => {
    let formattedPayload = ''
    if (action.toString !== Object.prototype.toString) {
      formattedPayload = action.toString()
    } else if (typeof action.payload !== 'undefined') {
      formattedPayload = inspectObject(action.payload)
    } else {
      formattedPayload = inspectObject(action)
    }

    console.log(` * ${action.type}: ${formattedPayload}`)
    return next(action)
  }
}
