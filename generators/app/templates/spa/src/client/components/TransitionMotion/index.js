/**
 * Copyright (c) 2009-2018 pandolajs.com, All rights reserved.
 * @fileoverview 页面转场
 * @author sizhao | sizhao@pandolajs.com
 * @version 1.0 | 2018-1-18 | sizhao       // 初始版本
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import TransitionMotion from 'react-motion/lib/TransitionMotion'
import spring from 'react-motion/lib/spring'
import each from 'lodash/each'

const springOption = {
  stiffness: 300,
  damping: 30,
  precision: 0.01
}

class Transition extends Component {
  static propTypes = {
    path: PropTypes.string.isRequired,
    children: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
    const { path, children } = props
    const route = {
      key: path,
      route: children
    }
    this.stack = [route]
    this.prev = {key: null}
    this.current = this.stack[this.stack.length - 1]
    this.state = {
      pages: [{
        ...route
      }]
    }

    this.shouldUpdate = true
    this.opType = 1 // 1: enter -1: back
    this.transition = false
  }

  getStyles() {
    const { pages } = this.state
    const styles = []
    const defaultStyles = []

    each(pages, page => {
      styles.push({
        key: page.key,
        data: page.route,
        style: {
          x: spring(0, springOption)
        }
      })
      defaultStyles.push({
        key: page.key,
        data: page.route,
        style: {
          x: 100 * this.opType
        }
      })
    })

    return {
      styles,
      defaultStyles
    }
  }

  willLeave = () => {
    return {
      x: spring(-100 * this.opType, springOption)
    }
  }

  willEnter = () => {
    return {
      x: 100 * this.opType
    }
  }

  _toCSSStyle = (style) => {
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      minHeight: '100%',
      transform: `translate3d(${style.x}%, 0, 0)`,
      WebkitTransform: `translate3d(${style.x}%, 0, 0)`
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.shouldUpdate
  }

  componentDidUpdate() {
    const { pages } = this.state
    this.shouldUpdate = pages.length !== 1
    pages.length >= 2 && pages.shift()
    this.setState({
      pages
    })
  }

  componentDidMount(){
    this.transition = true
  }

  componentWillReceiveProps(nextProps) {
    const { path, children } = nextProps
    const { stack, prev = {key: null}, current } = this
    const { pages } = this.state
    const route = {
      key: path,
      route: children
    }

    if(path === prev.key){
      stack.pop()
      this.opType = -1
    }else {
      stack.push(route)
      this.opType = 1
    }

    const length = stack.length
    this.current = stack[length - 1]
    this.prev = stack[length - 2]

    pages.push(route)
    this.setState({ pages })
    this.shouldUpdate = pages.length !== 1
  }

  render() {
    const { children } = this.props
    const { styles, defaultStyles } = this.getStyles()
    return this.transition ? (<TransitionMotion
      defaultStyles={defaultStyles}
      styles={styles}
      willLeave={this.willLeave}
      willEnter={this.willEnter}
    >
      {
        interpolatedStyles => {
          return <div>
            {interpolatedStyles.map(({style, data = null, key}) => {
              return <div key={key} style={this._toCSSStyle(style)}>
                { React.Children.only(data) }
              </div>
            })}
          </div>
        }
      }
    </TransitionMotion>) : React.Children.only(children)
  }
}

export default Transition
