/**
 * Copyright (c) 2009-2017 pandolajs.com, All rights reserved.
 * @fileoverview 微服务工厂
 * @author sizhao | sizhao@pandolajs.com
 * @version 1.0 | 2017-07-10 | sizhao       // 初始版本
 *
 * @description
 * 通过 serviceFactory 提供各个 service 类的单例；避免并发时产生过多的实例，消耗服务器资源
 */

export default function serviceFactory (Constructor, ctx) {
  let retIns
  if (Constructor.getInstance && Constructor.getInstance.apply) {
    retIns = Constructor.getInstance()
  } else {
    retIns = new Constructor(ctx)
  }

  if (Constructor.register && Constructor.register.apply) {
    Constructor.register({
      fetch: ctx.fetch
    })
  }

  return retIns
}
