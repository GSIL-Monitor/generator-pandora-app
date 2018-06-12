/**
 * Copyright (c) 2009-2017 pandolajs.com, All rights reserved.
 * @fileoverview 单例修饰器
 * @author sizhao | sizhao@pandolajs.com
 * @version 1.0 | 2017-07-10 | sizhao       // 初始版本
 *
 * @description
 * 为被修饰的类添加 getInstance 方法
 */

export default function (target) {
  const instance = Symbol('private property')
  target.getInstance = function () {
    if (!target[instance]) {
      target[instance] = new target() // eslint-disable-line new-cap
    }

    return target[instance]
  }
}
