/**
 * Copyright (c) 2009-present pandolajs.com, All rights reserved.
 * @fileoverview  APP ??
 * @author sizhao | sizhao@pandolajs.com
 * @version 1.0 | 2018-01-18 | sizhao
 */

import React from 'react'
import PropTypes from 'prop-types'
import { Provider as ReduxProvider } from 'react-redux'

const ContextType = {
  insertCss: PropTypes.func.isRequired,  // ?? critical path CSS rendering
  ...ReduxProvider.childContextTypes
}

class App extends React.PureComponent {
  static propTypes = {
    context: PropTypes.shape(ContextType).isRequired,
    children: PropTypes.element.isRequired
  };

  static childContextTypes = ContextType;

  getChildContext () {
    return this.props.context
  }

  render () {
    return React.Children.only(this.props.children)
  }
}

export default App
