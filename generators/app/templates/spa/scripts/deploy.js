/**
 * Copyright (c) 2009-2018 pandolajs.com, All rights reserved.
 * @fileoverview generator-react-koa init
 * @author sizhao | sizhao@pandolajs.com
 * @version 1.0 | 2018-1-18 | sizhao       // 初始版本
 */
import execa from 'execa'

const pkgName = process.env.npm_package_name
const env = process.env.NODE_ENV || 'development'

/**
 * Deploy the contents of the `/build` folder to a remote server
 */
async function deploy() {
  const startTime = Date.now()

  if (env === 'development') {
    return execa('pm2', ['startOrRestart', 'build/process.json', '--only', `${pkgName}-dev-server`], {
        stdio: 'inherit'
      })
      .then(({
        stdout
      }) => {
        console.log(stdout)
      })
  }

  return execa('pm2', ['startOrRestart', 'build/process.json', '--only', `${pkgName}-${env}`], {
      stdio: 'inherit'
    })
    .then(({
      stdout
    }) => {
      console.log(stdout)
    })
    .then(() => {
      const time = (Date.now() - startTime) / 1000
      console.log(`deploy success in ${time.toFixed(2)} s`)
    })
    .catch((err) => {
      console.log(err)
      process.exit(1)
    })
}

export default deploy