# http-client 选择背后的一些思考

在做前端脚手架的过程中，因为打算后续让项目支持离线功能并且能够对客户端的缓存有更大的可控性，所以打算在项目中引进 ServiceWorker，但是要让 ServiceWorker 能够对 client 的缓存做控制，fetch api 的支持是必不可少的。对于 fetch api 的支持，在位深入了解 ServiceWorker 之前，我进入了一个误区，那就是要支持 ServiceWorker, 就必须全局替换 http-client 库，其实不然，一下就对调研的结果以及最终的选择做一些简单的说明。

首先，说一说 ServiceWorker 在应用离线，缓存控制方面起了什么作用（WebWorkder, ServiceWorker 是什么？这里不做说明，自行 Google）。在实现 app 离线和对缓存的控制上，ServiceWorker 其实扮演的就是一个客户端代理服务器的角色，从他所监听的 scope 中发出的所有对资源的请求（html, js, css, ajax）都会经过这个代理，然后他会拿着请求去本地缓存中查找资源，如果命中，直接返回缓存，否则就使用 fetch api 去真正的服务端去请求该资源，响应回来后依旧会经过这个代理，然后你就可以做缓存或直接放行。

所以从上述的描述来看：

- 项目使用什么 http-client 与 ServiceWorker 并没有关系。
- 虽然 Fetch Api 相较 XMLRequestHttp 来讲更加未来，功能更加强大更加灵活外([MDN 如是说](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API))，概念上也更加清晰，但主流浏览器的支持情况却不容乐观，虽然 github 给出了遵守 [Fetch API 规范](https://fetch.spec.whatwg.org/) 的 polyfill [whatwg-fetch](https://github.com/github/fetch)，但是规范本身并没有完全稳定，polyfill 的实现本身也存在一些局限与 bug, 所以目前在生产环境中使用 Fetch API 或多或少还是存在一定风险的，而这些风险一旦被命中，修复成本是很昂贵的。
- 支持 ServiceWoker 的环境肯定支持 Fetch API, 而且还没有 ServiceWorker 的 polyfill, 所以单独引入 fetch polyfill 意义不大。

最终决定暂时放弃在项目中引入 Fetch API 的 polyfill 库，而且采用比较热门靠谱的 Axios，待 Fetch API 规范稳定，主流浏览器支持率较高或者 IE 没有市场份额后(玩笑~~)，再替换。

以下对调研过程中了解过的一些库做些总结：

- [whatwg-fetch](https://github.com/github/fetch)

Github 官方按照 [Fetch API 规范](https://fetch.spec.whatwg.org/) 实现的一套浏览器端的 fetch API polyfill

- [node-fetch](https://github.com/bitinn/node-fetch)

Node 端基于 http/https 实现的 Fetch API

- [cross-fetch](https://github.com/lquixada/cross-fetch) / [isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch)

包装以上两个库实现的 fetch 同构方案
