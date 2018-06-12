/**
 * Copyright (c) 2009-2018 pandolajs.com, All rights reserved.
 * @fileoverview 为 jest snapshot test 提供的 context 上下文组件
 * @author sizhao | sizhao@pandolajs.com
 * @version 1.0 | 2017-12-01 | sizhao       // 初始版本
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'

const context = {
  insertCss: jest.fn(),
  extraData: {}
}

const childContextTypes = {
  insertCss: PropTypes.func.isRequired,
  extraData: PropTypes.object
}

class ContextWrappedComponent extends Component {
  static propTypes = {
    context: PropTypes.shape(context),
    children: PropTypes.element.isRequired
  }

  static defaultProps = {
    context: context
  }

  static childContextTypes = childContextTypes

  getChildContext () {
    return this.props.context
  }

  render () {
    return React.Children.only(this.props.children)
  }
}

global.ContextWrappedComponent = ContextWrappedComponent
global.styledContext = context
global.childContextTypes = childContextTypes
global.enzymeOptions = {
  context,
  childContextTypes
}
