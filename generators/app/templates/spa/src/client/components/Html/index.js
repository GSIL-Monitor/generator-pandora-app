/**
 * Copyright (c) 2009-2018 pandolajs.com, All rights reserved.
 * @fileoverview Html 组件容器
 * @author sizhao | sizhao@pandolajs.com
 * @version 1.0 | 2018-1-18 | sizhao       // 初始版本
 */

import React from 'react'
import PropTypes from 'prop-types'
import baseStyle from 'Common/base.less'
import serialize from 'serialize-javascript'
import rem from 'Util/rem'

/* eslint-disable react/no-danger */

class Html extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    styles: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      cssText: PropTypes.string.isRequired
    }).isRequired),
    scripts: PropTypes.arrayOf(PropTypes.string.isRequired),
    app: PropTypes.object, // eslint-disable-line
    children: PropTypes.string.isRequired
  }

  static defaultProps = {
    styles: [],
    scripts: []
  }

  render () {
    const { title, description, styles, scripts, app, children } = this.props
    return (
      <html className='no-js'>
        <head>
          <title>{title}</title>
          <meta charSet='utf-8' />
          <meta httpEquiv='x-ua-compatible' content='ie=edge' />
          <meta name='description' content={description} />
          <meta name='viewport' content='width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no' />
          <meta name="format-detection" content="telephone=no" />
          <link rel='apple-touch-icon' href='/apple-touch-icon.png' />
          <link rel="shortcut icon" href="/favicon.ico"/>
          {/**
            * 动态设置root element font-size
            */}
          <script dangerouslySetInnerHTML={{__html: `!${serialize(rem)}(this);`}} />
          <style id='base-style' dangerouslySetInnerHTML={{__html: baseStyle._getCss()}} />
          {styles.map(style =>
            <style
              key={style.id}
              id={style.id}
              dangerouslySetInnerHTML={{ __html: style.cssText }}
            />
          )}
        </head>
        <body>
          <div id='app' dangerouslySetInnerHTML={{ __html: children }} />
          <script dangerouslySetInnerHTML={{ __html: `window.App=${serialize(app)}` }} />
          {scripts.map(script => <script key={script} src={script} />)}
        </body>
      </html>
    )
  }
}

export default Html
