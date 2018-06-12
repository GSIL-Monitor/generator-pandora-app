/**
 * Copyright (c) 2009-2018 pandolajs.com, All rights reserved.
 * @fileoverview generator-react-koa init
 * @author sizhao | sizhao@pandolajs.com
 * @version 1.0 | 2018-1-18 | sizhao       // 初始版本
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import history from 'Util/history'

class Home extends Component{
  link = () => {
    history.push('/about')
  }
  render(){
    const {...rest} = this.props
    return (<div {...rest}>
      <p>Hello World.</p>
      <a href="javascript:;" onClick={this.link}>About Me</a>
    </div>)
  }
}

export default Home
