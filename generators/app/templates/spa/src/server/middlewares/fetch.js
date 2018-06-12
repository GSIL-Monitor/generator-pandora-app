/**
 * Copyright (c) 2009-2018 pandolajs.com, All rights reserved.
 * @fileoverview koa fetch
 * @author sizhao | sizhao@pandolajs.com
 * @version 1.0 | 2018-1-18 | sizhao       // 初始版本
 */

import url from 'url'
import fetch from 'Util/fetch'

export default () => {
  return async(ctx, next) => {
    ctx.fetch = function (fetchUrl, opts = {}) {
      const headers = Object.assign({}, ctx.headers)

      // specify the target host
      headers.host = url.parse(fetchUrl, true, true).host

      opts.url = fetchUrl
      opts.headers = Object.assign(headers, opts.headers || {})

      // 返回 Promise 对象
      return fetch(fetchUrl, opts)
    }

    await next()
  }
}
