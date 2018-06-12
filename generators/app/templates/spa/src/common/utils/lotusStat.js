import lotusStat from '@wac/lotus-stat'

/* eslint-disable global-require */
const queryToObj = (str) => {
  const pairs = str.split('&')
  let params = {}
  pairs.forEach(pair => {
    const KVPair = pair.split('=')
    params[KVPair[0]] = KVPair[1]
  })
  return params
}

document.addEventListener('click', event => {
  const target = event.target
  try{
    if(target && target.hasAttribute('data-stat')){
      const dataStatStr = target.getAttribute('data-stat')
      if(!~dataStatStr.indexOf('=')){
        lotusStat.send(dataStatStr)
      }else{
        const params = queryToObj(dataStatStr)
        const eventName = params.event || ''
        params.event !== void 0 && (delete params.event)

        lotusStat.send(eventName, params)
      }
    }
  }catch(e){}
}, false)

export const PVSend = (eveId) => {
  if (!eveId) return
  let params
  ~eveId.indexOf('=') && (params = queryToObj(eveId), eveId = params.event || '', delete params.event)
  lotusStat.send(eveId, Object.assign({
    event_type: 'page',
    type: 9
  }, params))
}

lotusStat.init({
  APP_KEY: window.App.appKey,
  CHANNEL: queryToObj(location.search.slice(1)).channel || '',
  _trackPageBegin: false
})

export default lotusStat