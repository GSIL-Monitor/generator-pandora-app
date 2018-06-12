/**
 * Copyright (c) 2009-2018 pandolajs.com, All rights reserved.
 * @fileoverview About page
 * @author sizhao | sizhao@pandolajs.com
 * @version 1.0 | 2018-1-18 | sizhao       // 初始版本
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'

class About extends Component{
  render(){
    const {...rest} = this.props
    return (<div {...rest}>About Me</div>)
  }
}

export default About
