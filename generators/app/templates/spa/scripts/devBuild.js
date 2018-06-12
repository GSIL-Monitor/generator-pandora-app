import webpack from 'webpack'
import config from '../config/webpack/server'

webpack(config).run((error, stats) => {
  if(error){
    console.error(error)
  }
  console.log('Build successfully!')
})
