/**
 * Copyright (c) 2009-2018 pandolajs.com, All rights reserved.
 * @fileoverview fetch 通用
 * @author sizhao | sizhao@pandolajs.com
 * @version 1.0 | 2018-1-18 | sizhao       // 初始版本
 */

import axios from 'axios'

/**
 * @param errorCallback {Function} 错误回调
*/
export default (errorCallback) => {
  function fetch (url, options = {}) {
    const opts = Object.assign({}, options, {
      url
    })

    return axios(opts).then(response => {
      return response.data
    }).catch(error => {
      return Promise.reject(errorCallback(error, opts))
    })
  }

  const simpleMethods = ['get', 'delete', 'head', 'options']
  const complexMethods = ['post', 'put', 'patch']

  simpleMethods.forEach(method => {
    fetch[method] = (url, opts = {}) => {
      return fetch(url, Object.assign({}, opts, { method }))
    }
  })

  complexMethods.forEach(method => {
    fetch[method] = (url, data = {}, opts = {}) => {
      return fetch(url, Object.assign({}, opts, { method, data }))
    }
  })

  return fetch
}
