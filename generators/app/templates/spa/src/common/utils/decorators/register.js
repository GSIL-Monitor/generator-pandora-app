/**
 * Copyright (c) 2009-2017 pandolajs.com, All rights reserved.
 * @fileoverview 为修饰的类原型注册方法/属性
 * @author sizhao | sizhao@pandolajs.com
 * @version 1.0 | 2017-07-10 | sizhao       // 初始版本
 *
 * @description
 * 为被修饰的类增加 register 静态方法
 *
 * @example
 * // 可以提供参数，如下 fetch 方法将会扩张到 target 类的原型链上，并为 target 类增加 register 静态方法
 * @register({fetch: function(){...}})
 * class Test{
 *
 *  test(){
 *    this.fetch(...);
 *  }
 *  ...
 * }
 *
 * // 也可以不提供参数，则只是为 target 类添加 register 静态方法, 使用这种方式的类，通常不能独立使用，需要配合 factory 或者 proxy 来使用。
 * @register
 * class Test{
 *  ...
 * }
 */

/**
 * registerObj {Object|Class} 如果 Object 着 registerObj 的键值将会被扩展到 Target 类的原型链上
 * */
export default function (registerObj) {
  // 为被修饰的类增加 register 静态方法
  function bindRegister (target) {
    target.register = (key, value) => {
      let mixinObj = {}
      if (typeof key === 'string' && value != null) {
        mixinObj[key] = value
      }

      if (typeof key === 'object') {
        mixinObj = Object.assign(mixinObj, key)
      }

      Object.assign(target.prototype, mixinObj)
    }
  }

  if (typeof registerObj === 'object') {
    return (target) => {
      bindRegister(target)

      target.register(registerObj)
    }
  }

  bindRegister(registerObj)
}
