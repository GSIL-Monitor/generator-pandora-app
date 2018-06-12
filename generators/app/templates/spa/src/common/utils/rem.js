/**
 * Copyright (c) 2009-2018 pandolajs.com, All rights reseved.
 * @fileoverview 前端适配方案
 * @author sizhao | sizhao@pandolajs.com
 * @version 1.0 | 2018-06-26 | sizhao       // 初始版本
 */

export default function (global, width) {
  var window = global || this
  width = width || 750
  var docEl = window.document.documentElement
  var dpr = window.devicePixelRatio || 1
  var resizeEvt = 'resize'
  var resizeCall = (function () {
    var clientWidth = docEl.clientWidth
    if (!clientWidth) {
      docEl.style.fontSize = 100 + 'px'
    } else {
      docEl.style.fontSize = 100 * (clientWidth / parseInt(width)) + 'px'
    }
    return arguments.callee // eslint-disable-line no-caller
  })()

  dpr = dpr >= 3 ? 3 : dpr >= 2 ? 2 : 1
  docEl.setAttribute('data-dpr', dpr)

  window.addEventListener && window.addEventListener(resizeEvt, resizeCall, false)
}
