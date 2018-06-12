# 同构路由选择

同构路由其实这是两个概念，`同构` 和 `路由`。需要掰开了讲，然后再揉起来。

## 同构

这一节着重对同构进行说明。

isomorphic 字面意思是：同构的，同形的

维基百科中的解释是：

> 同构是在数学对象之间定义的一类映射,它能揭示出在这些对象的属性或者操作之间存在的关系。若两个数学结构之间存在同构映射，那么这两个结构叫做是同构的。一般来说，如果忽略掉同构的对象的属性或操作的具体定义，单从结构上讲，同构的对象是完全等价的。

在前端领域，同构通常是指 isomorphic javascript。

### what is isomorphic javascript

isomorphic javascript 经常也会有另外一个名字 universal javascript, 是指同一份 javascript 代码既可以在客户端运行，也可以在服务端运行。

### isomorphic javascript history

isomorphic javascript 并不是一个新概念，这个名词的诞生其实是得益于 Node.js 创建，Node.js 让曾经只能运行在浏览器中的语言在服务端也能运行成为可能。

2009 年 Node 发布了第一个版本。

2011 年 isomorphic javascript 第一次在一篇网文中出现。

但受限于 Node.js 能力有限 与 ECMAScript 规范滞后，当年同构并没有火起来。

isomorphic javascript 真正得到大家的重视，是随着 backbone.js, ember.js, anjular.js 等前端 MV* 框架的带来的 SPA 应用的火爆，同时 SPA SEO 不友好等越来越被重视而火了起来，再到 React.js Vue.js 等 View 层框架与前后端分离的再次追捧，真正的让 isomorphic javascript 成为前端圈内必舔的香饽饽。

### isomorphic javascript 的类型

isomorphic javascript 的类型有两类，一是 `真同构`， 二是 `伪同构`。

- `真同构` 是指 js 代码中不含任何宿主平台相关的代码（比如：浏览器端的 DOM API, Node.js 中的内置模块 fs, path 等），只包含纯 js 语言内容。

如下就是内容同构的js, 无论 add 函数在什么样的环境中执行，都不会有兼容性问题。

```
  function add(a, b){
    return a + b
  }
```

- `伪同构` js 代码中包含了宿主环境判断的代码，不同环境执行不同的分支，然后通过通过统一的 API 来达到同构的目的，严格来讲这种形式上的同构，不算真正的同构，不过目前很多 npm 包都是通过这种形式来实现同构的，比如热门的 Axios http-client 库。

### isomorphic JavaScript 的层次

同构不是一个布尔值，true 或者 false；同构是一个光谱形态，可以在很小范围里上实现同构，也可以在很大范围里实现同构。

- function 层次：零碎的代码片断或者函数，支持同构。比如浏览器端和服务端都实现了 setTimeout 函数，比如 lodash/underscore 的工具函数都是同构的。

- feature 层次：在这个层次里的同构代码，通常会承担一定的业务职能。比如 React 和 Vue 都借助 virtual-dom 实现了同构，它们是服务于 View 层的渲染；比如 Redux 和 Vuex 也是同构的，它们负责 Model 层的数据处理。

- framework 层次：在框架层面实现同构，它可能包含了所有层次的同构，需要精心处理支持同构和不支持同构的两个部分，如何妥善地整合在一起。

我们所做的脚手架其实就是 framework 层次的同构。

### isomorphic javascript 的好处

同构的好处这里不做累述。网上一大把，自行 google 之~~~

OK, 同构的内容就到这里，接下来说说路由。

## 路由

服务端的路由没什么好说的，这一节着重说说前端路由，前端路由的概念也是随着 SPA 的兴起创造出来的一个概念，传统的 web app 使用的路由都是对应服务端响应的，换句话说路由的切换伴随着客户端请求，后端响应。SPA 中的前端路由由一开始的url 中 hash 变化，在 History API 修改历史栈，做的都是地址栏中 url 看着是变了，其实并没有 http 请求产生，页面的切换都是在客户端完成的。

别的 view 层库没用过，这里就说说 React-Router 这个在 React 全家桶中重要的一员，但是 React-Router 将路由做成组件的，并嵌入在 view 层代码中的做法着实让人难以接受。

组件（Component）是 React 的核心概念，意欲将一系列逻辑相关的资源封装起来，更加内聚，提高逻辑复用，React 是一个 View 层框架，所以这一的 Component 强调的是 UI 层的封装，但并不是所有的东西都适合抽象成组件，路由就是其中之一，ReactTraining 团队强行将 Route 实现为组件，强行蹭概念，想法新奇但实则为一剂毒药，破坏语义，腐蚀抽象美感，更糟糕的是强行将 UI 不相关的逻辑与 UI 层代码绑定，实际上是与 React 所提倡的组件化相悖的。虽然 React-Router 也支持 SSR，但是实现着实不敢恭维。

## 同构路由

`同构` 与 `路由` 都掰开讲完了，合起来的意思也就自然而然的出来了。

`同构路由`：就是既能在 Server 端运行，又能在 Client 运行的路由。

这里我们选择 `universal-route` 作为项目中的同构路由方案。

- 这是一款中间件风格的同构路由方案，语法与用法上与 Server 端路由基本一致，对于一线开发人员来说，概念理解上没有跳跃性，主观更容易理解接受，而不用 rape 开发人员的思想去接受 `路由也是组件` 的想法。

- 与 Server 端更易集成，使用上就一个 api 接口，简单易用，而且易扩展。
