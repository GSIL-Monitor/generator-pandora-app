import path from 'path'
import url from 'url'
import yaml from 'js-yaml'
import deploy from '@wac/static-deploy'
import { readFile, writeFile } from './lib/fs'
import run from './run'
import build from './build'
import webpackConfig from '../config/webpack.config'

const root = path.join(__dirname, '../')
const processPath = path.join(root, 'process.json')
const processJson = require(processPath)

let env = process.env.NODE_ENV || 'development'
if (env === 'staging') {
  env = 'test'
}

const appConfigPath = path.join(root, 'config/app.yaml')
// eslint-disable-next-line no-unused-vars
const [ clientConfig, serverConfig ] = webpackConfig
const pkgName = process.env.npm_package_name
const buildPath = clientConfig.output.path
const publicPath = clientConfig.output.publicPath

async function compile () {
  const startTime = Date.now()

  const yamlConfig = await readFile(appConfigPath)
  const appConfig = yaml.safeLoad(yamlConfig)
  const serverConfig = appConfig.server || {}
  const debugPort = serverConfig.debugPort || 7080

  // build server & client
  await run(build)

  processJson.apps.forEach((app) => {
    if (/development|test/.test(app.name)) {
      app.node_args = `${app.node_args || ''} --inspect=${debugPort}`
    }

    if (app.name.indexOf(pkgName) !== 0) {
      app.name = `${pkgName}-${app.name}`
    }
  })
  await writeFile(path.join(root, 'build/process.json'), JSON.stringify(processJson, null, 2))

  if (['test', 'production'].indexOf(env) === -1) {
    return Promise.resolve()
  }
  // 发布静态资源
  const parsedUrl = url.parse(publicPath, true, true)
  const assetsPath = parsedUrl.pathname

  return deploy({
    env,
    cwd: buildPath,
    imagemin: true,
    path: assetsPath
  }).then((ret) => {
    if (ret.code !== 0) {
      return Promise.reject(ret.error)
    }

    console.log('publich success')
    console.log(JSON.stringify(ret, null, 4))
  })
  .then(() => {
    const time = (Date.now() - startTime) / 1000
    console.log(`compile success in ${time.toFixed(2)} s`)
  })
}

export default compile
