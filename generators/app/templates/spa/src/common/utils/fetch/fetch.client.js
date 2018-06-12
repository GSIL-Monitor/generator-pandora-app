/**
 * Copyright (c) 2009-2018 pandolajs.com, All rights reserved.
 * @fileoverview browser http-client
 * @author sizhao | sizhao@pandolajs.com
 * @version 1.0 | 2018-1-18 | sizhao       // 初始版本
 */

import fetchConfig from './fetch.config'

const fetch = fetchConfig((error, options) => {
  console.error(error)
})

export default fetch
