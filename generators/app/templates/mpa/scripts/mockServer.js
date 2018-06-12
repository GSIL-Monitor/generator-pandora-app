import fs from 'fs'
import path from 'path'
import Koa from 'koa'
import Router from 'koa-router'
import jsonp from 'koa-jsonp'
import cookie from 'koa-cookie'
import bodyParser from 'koa-bodyparser'
import ip from 'dev-ip'
import yaml from 'js-yaml'
import Promise from 'bluebird'
import glob from 'glob'

const devIp = ip()[0]
const root = path.join(__dirname, '..')
const appConfigPath = path.join(root, 'config/app.yaml')
const appConfig = yaml.safeLoad(fs.readFileSync(appConfigPath))
const devPort = appConfig.server.devPort

const router = new Router()
const methodSupportList = ['get', 'post', 'put', 'patch', 'delete', 'all']
const dir = path.join(root, './mock')
glob.sync('**/*.js', { cwd: dir }).forEach((filePath) => {
  /**
   * 默认路由规则：
   * 文件的路径 + 文件名（如果文件名中含有‘-’，则转化为'/'；如果文件名为index.js，则路径忽略index）
   * example:  /mock/user-findPassword-getCaptcha.js ---> /mock/user/findPassword/getCaptcha
   * example:  /mock/client/user-findPassword-getCaptcha.js ---> /mock/client/user/findPassword/getCaptcha
   * example:  /mock/user-findPassword-index.js ---> /mock/user/findPassword
   * */
  const apiPath = filePath.replace(/(\/?[\w\-\d]+?)(\.js)$/, (str, $1, $2) => {
    const splitDirs = $1.split('-')
    if (splitDirs[splitDirs.length - 1] === 'index') {
      splitDirs.splice(0, -1)
    }
    return splitDirs.join('/')
  })

  const apis = require(path.join(dir, filePath))
  Object.values(apis).forEach((api) => {
    let [method, route] = (api.path || '').split('::')
    // 优先使用mock文件指定的method，否则使用get方法
    method = methodSupportList.indexOf(method) !== -1 ? method : 'all'
    // 优先使用mock文件指定的route，否则使用默认路由规则
    route = route || apiPath
    router[method](`/mock/${route}`, async (ctx) => {
      const result = await api(ctx)
      ctx.body = JSON.stringify(result)
    })
  })
})

function mockServer () {
  const app = new Koa()
  app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*')
    ctx.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    ctx.set('Access-Control-Allow-Headers', 'accesstoken,appplatform,appversion,channeltype,deviceid,mccode,refreshtoken,systeminfo')
    await next()
  })
  app.use(bodyParser())
  app.use(cookie())
  app.use(jsonp())
  app.use(router.routes(), router.allowedMethods())
  app.listen(devPort, () => {
    console.log(`mock-server started at http://${devIp}:${devPort}`)
  })

  process.on('exit', () => {
    app.kill('SIGTERM')
  })

  return Promise.resolve(app)
}

export default mockServer
