/**
 * Copyright (c) 2009-2018 pandolajs.com, All rights reserved.
 * @fileoverview 同构路由
 * @author sizhao | sizhao@pandolajs.com
 * @version 1.0 | 2018-1-18 | sizhao       // 初始版本
 */

import React from 'react'
import IsomorphicRouter from '@wac/isomorphic-router'
import notFound from 'Server/routes/notFound'

const requireContext = require.context('../../server/routes', true, /^\.\/[^_][\w-]+\/index\.js$/)

const iRouter = new IsomorphicRouter(requireContext, {
  baseUrl: '',
  exclude: /\.\/notFound\//,
  notFound: notFound
})

iRouter.catch((error, context) => {
  console.log('error happend', error)
  return {
    redirect: '/error'
  }
})

iRouter.use(async (context, next) => {
  const route = await next()

  if(route && React.isValidElement(route.component)){
    route.title = route.title || '',
    route.description = route.description || '',
    route.keywords = route.keywords || ''
  }

  return route === undefined ? null : route
})

export default iRouter.router()
