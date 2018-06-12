/**
 * Copyright (c) 2009-2018 pandolajs.com, All rights reserved.
 * @fileoverview controller 修饰器
 * @author yanri | yanri@wacai.com
 * @version 1.0 | 2018-01-22 | 掩日       // 初始版本
 * @version 2.0 | 2018-01-24 | 思召       // 接口重构
 */

import each from 'lodash/each'

const setConfig = (options = {}) => (target, name, descriptor) => {
  if (typeof target[name] !== 'function') {
    throw new Error('The method decorator can only be used in a function')
  }

  descriptor.enumerable = true

  const config = target[name].__config__

  each(options, (value, key) => {
    if (key === 'httpMethods') {
      let method = value
      if (!config) {
        value = [method]
      } else {
        value = config.httpMethods || []
        value.indexOf(method) === -1 && value.push(method)
      }
    }

    target[name].__config__ = {
      methodName: name,
      ...config,
      [key]: value
    }
  })

  return descriptor
}

const httpMethods = (method) => {
  return setConfig({'httpMethods': method})
}

// 设置一个类为 Controller
export default function controller (target) {
  target.__controller__ = true
}

// 设置 class method 为 get 接口
export const get = httpMethods('get')

// 设置 class method 为 post 接口
export const post = httpMethods('post')

/**
 * 设置 class method 为 method 接口，
 * @param url {String} router subpath.  e.g /:userId 最终的输出为 /api/xxx/:userId
 * @param method {String}
*/
export const requestMapping = (url, method) => {
  const options = {
    routeUrl: url
  }
  method && (options.httpMethod = method)
  return setConfig(options)
}

export const isController = (controller) => {
  return controller.__controller__
}

export const getMethodConfig = (controller, key) => {
  const config = controller.prototype[key].__config__
  if (config) {
    if ((!config.httpMethods || config.httpMethods.length === 0)) {
      config.httpMethods = ['get']
    }

    if (!config.routeUrl) {
      config.routeUrl = `/${config.methodName}`
    }
  }
  return config
}
