/**
 * Copyright (c) 2009-2018 pandolajs.com, All rights reserved.
 * @fileoverview koa 路由
 * @author sizhao | sizhao@pandolajs.com
 * @version 1.0 | 2018-1-18 | sizhao       // 初始版本
 */

import Router from 'koa-router'
import { isController, getMethodConfig } from 'Util/decorators/controller'

const router = new Router()

const req = require.context('../../server/controllers', true, /^\.\/[^_][\w-]+\/[\w_-]+\.js$/)
const routes = {}
const mods = req.keys()
mods.forEach((mod) => {
  const ctrl = req(mod).default
  let path = mod.substring(1, mod.length - 3).replace(/\/index$/, '/')

  if (typeof ctrl === 'function' && isController(ctrl)) {
    const constrollerInst = new ctrl()
    const prototype = ctrl.prototype
    Object.keys(prototype).forEach(key => {
      const config = getMethodConfig(ctrl, key)
      if (config) {
        config.httpMethods && config.httpMethods.forEach((method) => {
          const { routeUrl } = config
          path = `${method}::${path}${routeUrl.charAt(0) === '/' ? '' : '/'}${routeUrl}`
          routes[path] = prototype[key].bind(constrollerInst)
        })
      }
    })
  }else{
    throw new Error(`[TypeError]: ${mod} is an invalid Controller.`)
  }
})
// method::routePath 解析 =>  调用 router[method](routePath, action)
const supportMethods = ['get', 'post', 'put', 'delete', 'all']
Object.keys(routes).forEach((key) => {
  const action = routes[key]
  let [method, routePath] = (key || '').split('::')
  if (method && !routePath) {
    routePath = method
    method = ''
  }
  method = (method || 'all').toLowerCase()
  if (supportMethods.indexOf(method) >= 0 && router[method] && typeof action === 'function') {
    router[method](routePath, action)
  }
})

export default router
