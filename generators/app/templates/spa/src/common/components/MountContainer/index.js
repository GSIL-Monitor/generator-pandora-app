/**
 * Copyright (c) 2009-2017 pandolajs.com, All rights reserved.
 * @fileoverview 窗口组件挂载容器
 * @author sizhao | sizhao@pandolajs.com
 * @version 1.0 | 2017-07-20 | sizhao       // 初始版本
 *
 * @description
 * 为 Toast, Dialog, Loading 提供装载容器
 */

import React, {Component} from 'react'
import PropTypes from 'prop-types'

export default class extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired
  }

  static childContextTypes = {
    insertCss: PropTypes.func.isRequired
  }

  getChildContext () {
    return {
      insertCss: (...styles) => {
        // eslint-disable-next-line no-underscore-dangle
        const removeCss = styles.map(style => style._insertCss())
        return () => { removeCss.forEach(f => f()) }
      }
    }
  }

  render () {
    return React.Children.only(this.props.children)
  }
}
