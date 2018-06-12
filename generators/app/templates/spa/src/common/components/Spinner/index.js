/**
 * Copyright (c) 2009-2017 pandolajs.com, All rights reseved.
 * @fileoverview Loading component 脚本
 * @author sizhao | sizhao@pandolajs.com
 * @version 1.0 | 2017-08-01 | sizhao       // 初始版本
 */

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import styles from './index.less'
import ReactDom from 'react-dom'
import MountContainer from '@wac/wac-ui-mob/MountContainer'

@withStyles(styles)
class LoadingSpinner extends PureComponent {
  static propTypes = {
    show: PropTypes.bool
  }

  render () {
    const { show } = this.props

    return (
      <div>
        { show ? (
          <div className={styles['m-layout']}>
            <div className={styles['m-spinner-container']}>
              { [0, 1, 2].map((i) => {
                return (<div key={i} className={styles['c-spinner-box']}>
                  <div className={styles['c-spinner-dot']} />
                  <div className={styles['c-spinner-dot']} />
                  <div className={styles['c-spinner-dot']} />
                  <div className={styles['c-spinner-dot']} />
                </div>)
              }) }
            </div>
          </div>
        ) : null }
      </div>
    )
  }
}

const loading = (show) => {
  let spinnerContainer = document.querySelector('#spinner-container')
  if (!spinnerContainer) {
    spinnerContainer = document.createElement('div')
    spinnerContainer.setAttribute('id', 'spinner-container')
    document.body.appendChild(spinnerContainer)
  }

  ReactDom.render((<MountContainer><LoadingSpinner show={show} /></MountContainer>), spinnerContainer)
}

export { loading }

export default LoadingSpinner
