/**
 * Copyright (c) 2009-2018 pandolajs.com, All rights reserved.
 * @fileoverview enzyme 配置文件
 * @author sizhao | sizhao@pandolajs.com
 * @version 1.0 | 2017-12-01 | sizhao       // 初始版本
 */

import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({
  adapter: new Adapter()
})
