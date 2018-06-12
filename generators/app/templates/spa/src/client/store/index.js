/**
 * Copyright (c) 2009-2018 pandolajs.com, All rights reserved.
 * @fileoverview generator-react-koa init
 * @author sizhao | sizhao@pandolajs.com
 * @version 1.0 | 2018-1-18 | sizhao       // 初始版本
 */

import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from 'Util/reducers'
import createLogger from './logger'

export default function configureStore (initialState, helpersConfig) {
  const helpers = helpersConfig
  const middleware = [thunk.withExtraArgument(helpers)]

  let enhancer

  if (__DEV__) {
    middleware.push(createLogger())

    // https://github.com/zalmoxisus/redux-devtools-extension#redux-devtools-extension
    let devToolsExtension = f => f
    if (process.env.BROWSER && window.devToolsExtension) {
      devToolsExtension = window.devToolsExtension()
    }

    enhancer = compose(
      applyMiddleware(...middleware),
      devToolsExtension
    )
  } else {
    enhancer = applyMiddleware(...middleware)
  }

  // See https://github.com/rackt/redux/releases/tag/v3.1.0
  const store = createStore(rootReducer, initialState, enhancer)

  // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
  if (__DEV__ && module.hot) {
    module.hot.accept('Util/reducers', () =>
      // eslint-disable-next-line global-require
      store.replaceReducer(require('Util/reducers').default)
    )
  }

  return store
}
