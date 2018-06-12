/**
 * Copyright (c) 2009-2018 pandolajs.com, All rights reserved.
 * @fileoverview spa server
 * @author sizhao | sizhao@pandolajs.com
 * @version 1.0 | 2018-1-18 | sizhao       // 初始版本
 */

import Koa from 'koa'
import serve from 'koa-static'
import bodyParser from 'koa-bodyparser'
import logger from '@wac/koa-logger'
import session from 'koa-session'
import cookie from 'koa-cookie'
import React from 'react'
import ReactDOM from 'react-dom/server'
import path from 'path'
import iRouter from 'Util/isomorphic-router'
import App from 'Component/App'
import Html from 'Component/Html'
import assets from './assets.json' // eslint-disable-line import/no-unresolved
import controllers from 'Util/controller'
import fetchMiddleware from 'Server/middlewares/fetch'
import config from 'Util/config'
import configureStore from 'Client/store'

const port = config.server.port
const env = process.env.NODE_ENV || 'development'

const app = new Koa()
app.name = 'react-koa-spa'
app.key = ['react koa node spa secret key']

// 设置打点配置
const lotusStatAppKey = config.stat

// 注册 Koa 中间件
app.use(logger(app, {
  levelMap: config.logLevel
}))
app.use(serve(path.resolve(__dirname, 'public')))
app.use(bodyParser())
app.use(cookie())
app.use(session({
  key: 'koa:sess',
  maxAge: 24 * 60 * 60 * 1000,
  overwrite: true,
  httpOnly: true,
  signed: true
}, app))

app.use(fetchMiddleware())
app.use(controllers.routes(), controllers.allowedMethods())

app.on('error', (error, ctx) => {
  ctx && ctx.log.error(error)
})

app.use(async(ctx, next) => {
  const css = new Set()

  const route = await iRouter.resolve({
    pathname: ctx.path,
    query: ctx.query,
    fetch: ctx.fetch,
    ctx
  })

  if(route.redirect){
    ctx.status = route.status || 302,
    ctx.redirect(route.redirect)
    return await next()
  }

  if(!React.isValidElement(route.component)){
    ctx.status = route.status || 200
    ctx.body = route.component
    return await next()
  }

  let initialState = {}
  if (typeof route.initialState === 'function') {
    initialState = route.initialState({
      path: ctx.path,
      query: ctx.query
    })
  } else if (route.initialState !== undefined) {
    initialState = route.initialState
  }

  const store = configureStore({ ...initialState })

  const context = {
    insertCss: (...styles) => {
      styles.forEach(style => css.add(style._getCss()))
    },
    store,
    storeSubscription: null
  }

  const data = { ...route }
  data.children = ReactDOM.renderToString(
    <App context={context} store={store}>
      {route.component}
    </App>
  )
  data.styles = [
    { id: 'css', cssText: [...css].join('') }
  ]
  data.scripts = [
    assets.vendor.js,
    assets.client.js
  ]
  if (assets[route.chunk]) {
    data.scripts.push(assets[route.chunk].js)
  }

  const headers = ctx.req.headers
  data.app = {
    apiUrl: config.api.clientUrl,
    state: context.store.getState(),
    PVStat: route.PVStat,
    appKey: lotusStatAppKey
  }

  const html = ReactDOM.renderToStaticMarkup(<Html {...data} />)
  ctx.status = route.status || 200
  ctx.body = `<!doctype html>${html}`

  await next()
})

app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}/`)
})
