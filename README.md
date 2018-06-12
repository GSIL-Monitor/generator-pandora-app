# generator-pandolajs-app

`generator-pandolajs-app` 是以 yeoman 作为技术支持的前端脚手架。项目脚手架一般由脚手架工具与项目模板两部分组成项目。项目模板使用 react, Koa2 分别作为前端 UI 解决方案和 Node 端同构框架，而脚手架工具的主要工作就是收集用户配置将项目模板初始化为具体的项目。

做脚手架的主要目的就是想在公司层面统一前端的技术栈，降低一线业务开发因项目调整带来的额外的学习成本。

选择 yeoman 作为 react-koa 脚手架的底层技术支撑，主要是想把 react-koa 脚手架作为前端工程化的一部分，方便后续集成（wax 集成），其次就是 yeoman 真的是一个不错的脚手架解决方案，功能强大，使用方便，扩展灵活。

## Q&A

在开头先做一些自己假象的 Q&A, 其实也不全是自己想的啦，其实也是之前有人问过的。 

- 既然开源的 react + koa2 的脚手架辣么多，为什么还是费力自己搞？

这个问题问的好，其实有一个类似的问题，`这个功能是在 xxx 库中有了，你为什么还要自己写啊？` 这样的问题本质上是，如何权衡使用开源库与自己实现。答案当然是 `见人说人话，见鬼说鬼话喽`，怎么理解呢？那就是根据自己的实际情况来定（跟没说一样）。使用开源库的好处是不言而喻的，很省事，提高工作效率，吧啦吧啦~~~

那坏处呢？

- 可能冗余，我们只用到了其中的一小部分功能，却要引入一大坨没用到的代码，当然如果我们选择的库能像 lodash 那样就不一样了或者项目中使用了 webpack2/rollup tree-shaking 来帮忙优化（有局限）。
- 不可控，出现 bug 或者需要新增功能时，流程可能会稍微长点，如果是 bug，提个 PR 还是很好被合并的，但如果是新功能，就不一定了，但不可否认的是 pr 不一定都能立马被合并，但是我们出现 bug 一般都是需要快速响应并修复的。
- 为了满足特定的业务需求可能会有比较大的改动或者 hack, 当然这一点就是针对脚手架这类型开源项目的，而非工具库。

现在回到问题本身，generator-pandolajs-app 意在提供一套满足自己项目需求的 react-koa 脚手架，出于各种原因，会有很多限制，使用开源的项目，必然会做很多本地化修改，所以并不打算使用开源项目而是自己开发。

## 用法

1. 既然使用了 yeoman, 首先我们得安装 yo

```
    npm i -g yo
```

2. 在安装 react-koa 项目生成器

```
    npm i -g generator-pandolajs-app
```

3. 然后生成项目

```
    // 多页项目
    yo react-koa projectName --mpa

    // 单页项目
    yo react-koa projectName --spa
```

4. 恭喜你，可以愉快的写 bug 了~~~

## 脚手架项目模板

目前脚手架支持两种类型的项目模型，SPA / MPA 

源码目录结构如下：

```
// SPA
.
├── client                  // 客户端相关目录
│   ├── actions
│   ├── componets
│   ├── pages
│   ├── reducers
│   ├── store
│   └── index.js
├── common                  // 通用模块相关
│   ├── constants
│   └── utils
└── server                  // node 端模块相关
    ├── controllers
    ├── middlewares
    ├── routes
    ├── services
    └── index.js

// MPA
.
├── client                  // 客户端相关目录
│   ├── componets
│   └── pages
├── common                  // 通用模块相关
│   ├── constants
│   └── utils
└── server                  // node 端模块相关
    ├── controllers
    ├── middlewares
    ├── routes
    ├── services
    └── index.js
```
从上述目录结构可以看出，相较于已经在运行的项目(信用保镖（SPA）,卡窗主站（MPA）)，重新对目录结构做了调整，让目录结构更加清晰。

无论是 SPA 还是 MPA 项目 `src` 目录下都只有 `client` `server` `common`.

接下来 SPA 与 MPA 的组大的差别就是 `client` 目录中没有了 Redux 相关的文件夹。

目前只对目录做了规范约定，具体的技术栈还没有梳理完，因为在具体项目实践的过程中依旧有一些问题没有完美解决以及一些冗余的内容，所以接下来的主要工作内容就是梳理 `S/MPA` 的技术栈，完善项目模板。

待梳理的技术点：

- 独立 mock server
- ~~http client 库选择~~ 最终选择使用 Axios 作为项目的 http-client 库，这里是[http-client 选择背后的一些思考](docs/http-client.md)
- ~~前端路由库~~ 使用 [universal-router](https://github.com/kriasoft/universal-router), 查看[这里](docs/isomorphic-router.md)了解一些选型时的考量

将要支持的功能：

- 离线应用
- PWA
- spa 页面转场效果

## 如何贡献

由于目前只完成了脚手架工具部分，而项目模板只是做了目录结构规划但是技术栈依旧没有统一，所以暂时没有发布为 npm 包，大家通过如下步骤，在本地生成 spa 和 mpa 的项目帮忙完善项目模板。

```
  // 检出项目 
  git clone git@git.pandolajs.com.com:sizhao/generator-pandolajs-app.git

  // npm 本地 link
  cd generator-pandolajs-app
  npm link

  // 安装 yeoman
  npm i -g yo

  // 生成 spa 项目
  yo react-koa spa --spa

  // 生成 mpa 项目
  yo react-koa mpa --mpa
```
