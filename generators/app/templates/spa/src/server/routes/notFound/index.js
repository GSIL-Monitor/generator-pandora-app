/**
 * Copyright (c) 2009-2018 pandolajs.com, All rights reserved.
 * @fileoverview 404 路由
 * @author sizhao | sizhao@pandolajs.com
 * @version 1.0 | 2018-1-18 | sizhao       // 初始版本
 */

import React from 'react'

export default {
  path: '(.*)',
  async action(){
    return {
      title: '404',
      component: (
        <div>This is 404.</div>
      )
    }
  }
}
