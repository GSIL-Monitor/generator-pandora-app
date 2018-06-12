/**
 * Copyright (c) 2009-2018 pandolajs.com, All rights reserved.
 * @fileoverview api path 转换库,判断环境 拼接完整路径
 * @author sizhao | sizhao@pandolajs.com
 * @version 1.0 | 2017-07-10 | sizhao       // 初始版本
 * @version 1.1 | 2017-11-20 | sizhao       // 适配 oblisk3
 */

import url from 'url'
import path from 'path'
import config from './config'

const baseUrl = config.api

/**
 * @param relativePath {String} 待组装的 path, 如果该 path 是以 https? 开头的 url, 直接返回
 * @return {String} 组装后的 url
*/
export default (relativePath) => {
  let apiPath = []
  const localBase = /^https?:\/\//.test(relativePath) ? relativePath : (apiPath.push(relativePath), baseUrl)

  const parsed = url.parse(localBase, true, true)

  parsed.pathname = path.join(parsed.pathname, ...apiPath)

  return parsed.format()
}

export { baseUrl }
