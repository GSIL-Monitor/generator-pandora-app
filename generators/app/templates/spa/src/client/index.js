/**
 * Copyright (c) 2009-2018 pandolajs.com, All rights reserved.
 * @fileoverview generator-react-koa init
 * @author sizhao | sizhao@pandolajs.com
 * @version 1.0 | 2018-1-18 | sizhao       // 初始版本
 */

import React from 'react'
import ReactDOM from 'react-dom'
import FastClick from 'fastclick'
import queryString from 'query-string'
import App from 'Component/App'
import configureStore from 'Client/store'
import history from 'Util/history'
import { updateMeta } from 'Util/DOMUtils'
import { ErrorReporter, deepForceUpdate } from 'Util/devUtils'
import lotusStat, { PVSend } from 'Util/lotusStat'
import { loading } from '@wac/wac-ui-mob/Spinner'
import { LOCATION_CHANGE_ACTION_TYPE } from 'Common/constants'
import iRouter from 'Util/isomorphic-router'
import fetch from 'Util/fetch'
import TransitionMotion from 'Component/TransitionMotion'

// Global (context) variables that can be easily accessed from any React component
// https://facebook.github.io/react/docs/context.html
const context = {
  // Enables critical path CSS rendering
  // https://github.com/kriasoft/isomorphic-style-loader
  insertCss: (...styles) => {
    // eslint-disable-next-line no-underscore-dangle
    const removeCss = styles.map(x => x._insertCss())
    return () => { removeCss.forEach(f => f()) }
  },

  // Initialize a new Redux store
  // http://redux.js.org/docs/basics/UsageWithReact.html
  store: configureStore(window.App.state, { history })
}

// Switch off the native scroll restoration behavior and handle it manually
// https://developers.google.com/web/updates/2015/09/history-api-scroll-restoration
const scrollPositionsHistory = {}
if (window.history && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

let onRenderComplete = function initialRenderComplete () {
  const elem = document.getElementById('css')
  if (elem) elem.parentNode.removeChild(elem)
  loading(false)
  onRenderComplete = function renderComplete (route, location) {
    document.title = route.title
    loading(false)

    updateMeta('description', route.description)
    // Update necessary tags in <head> at runtime here, ie:
    // updateMeta('keywords', route.keywords);
    // updateCustomMeta('og:url', route.canonicalUrl);
    // updateCustomMeta('og:image', route.imageUrl);
    // updateLink('canonical', route.canonicalUrl);
    // etc.

    let scrollX = 0
    let scrollY = 0
    const pos = scrollPositionsHistory[location.key]
    if (pos) {
      scrollX = pos.scrollX
      scrollY = pos.scrollY
    } else {
      const targetHash = location.hash.substr(1)
      if (targetHash) {
        const target = document.getElementById(targetHash)
        if (target) {
          scrollY = window.pageYOffset + target.getBoundingClientRect().top
        }
      }
    }

    // Restore the scroll position if it was saved into the state
    // or scroll to the given #hash anchor
    // or scroll to top of the page
    window.scrollTo(scrollX, scrollY)
    PVSend(route.PVStat)
  }
}

// Make taps on links and buttons work fast on mobiles
FastClick.attach(document.body)

const container = document.getElementById('app')
let appInstance
let currentLocation = history.location

// Re-render the app when window.location changes
async function onLocationChange (location, action) {
  action !== LOCATION_CHANGE_ACTION_TYPE.INIT && loading(true)
  // Remember the latest scroll position for the previous location
  scrollPositionsHistory[currentLocation.key] = {
    scrollX: window.pageXOffset,
    scrollY: window.pageYOffset
  }
  // Delete stored scroll position for next page if any
  if (action === LOCATION_CHANGE_ACTION_TYPE.PUSH) {
    delete scrollPositionsHistory[location.key]
  }
  currentLocation = location

  try {
    // Traverses the list of routes in the order they are defined until
    // it finds the first route that matches provided URL path string
    // and whose action method returns anything other than `undefined`.

    const locationState = action === LOCATION_CHANGE_ACTION_TYPE.INIT ?
      window.App.state : location.state

    const route = await iRouter.resolve({
      ...context,
      pathname: location.pathname,
      locationState: locationState || {},
      query: queryString.parse(location.search),
      fetch: (url, opts) => {
        return fetch(url, opts)
      }
    })

    // Prevent multiple page renders during the routing process
    if (currentLocation.key !== location.key) {
      return
    }

    if (route.redirect) {
      history.replace(route.redirect)
      return
    }
    const PageComponent = route.component
    appInstance = ReactDOM.hydrate(
      <App context={context}>
        <TransitionMotion path={location.pathname}>
          {route.component}
        </TransitionMotion>
      </App>,
      container,
      () => onRenderComplete(route, location)
    )
  } catch (error) {
    // Display the error in full-screen for development mode
    if (__DEV__) {
      appInstance = null
      document.title = `Error: ${error.message}`
      ReactDOM.hydrate(<ErrorReporter error={error} />, container)
      throw error
    }

    console.error(error)

    // Do a full page reload if error occurs during client-side navigation
    if (action && currentLocation.key === location.key) {
      window.location.reload()
    }
  }
}

// Handle client-side navigation by using HTML5 History API
// For more information visit https://github.com/mjackson/history#readme
history.listen(onLocationChange)
onLocationChange(currentLocation, LOCATION_CHANGE_ACTION_TYPE.INIT)
PVSend(window.App.PVStat)

// Handle errors that might happen after rendering
// Display the error in full-screen for development mode
if (__DEV__) {
  window.addEventListener('error', (event) => {
    appInstance = null
    document.title = `Runtime Error: ${event.error.message}`
    ReactDOM.render(<ErrorReporter error={event.error} />, container)
  })
}

// Enable Hot Module Replacement (HMR)
if (module.hot) {
  module.hot.accept('Util/isomorphic-router', () => {
    router = require('Util/isomorphic-router').default

    if (appInstance) {
      try {
        // Force-update the whole tree, including components that refuse to update
        deepForceUpdate(appInstance)
      } catch (error) {
        appInstance = null
        document.title = `Hot Update Error: ${error.message}`
        ReactDOM.render(<ErrorReporter error={error} />, container)
        return
      }
    }

    onLocationChange(currentLocation)
  })
}
