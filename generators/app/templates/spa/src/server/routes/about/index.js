/**
 * Copyright (c) 2009-2018 pandolajs.com, All rights reserved.
 * @fileoverview 首页路由
 * @author sizhao | sizhao@pandolajs.com
 * @version 1.0 | 2018-1-18 | sizhao       // 初始版本
 */

import React from 'react'
import About from 'Page/about'

export default {
  path: '/about',
  async action(){
    return {
      title: '关于我',
      component: (
        <About />
      )
    }
  }
}
