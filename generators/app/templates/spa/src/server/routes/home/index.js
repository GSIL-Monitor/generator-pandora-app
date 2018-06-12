/**
 * Copyright (c) 2009-2018 pandolajs.com, All rights reserved.
 * @fileoverview 首页路由
 * @author sizhao | sizhao@pandolajs.com
 * @version 1.0 | 2018-1-18 | sizhao       // 初始版本
 */

import React from 'react'
import Home from 'Page/home'

export default {
  path: '/',
  async action(){
    return {
      title: '首页',
      component: (
        <Home />
      )
    }
  }
}
