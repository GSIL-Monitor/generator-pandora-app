/**
 * Copyright (c) 2009-2018 pandolajs.com, All rights reserved.
 * @fileoverview generator-react-koa init
 * @author sizhao | sizhao@pandolajs.com
 * @version 1.0 | 2018-1-18 | sizhao       // 初始版本
 */
const MarkdownIt = require('markdown-it')
const fm = require('front-matter')

module.exports = function markdownLoader(source) {
  const md = new MarkdownIt({
    html: true,
    linkify: true
  })

  const frontmatter = fm(source)
  frontmatter.attributes.html = md.render(frontmatter.body)

  return `module.exports = ${JSON.stringify(frontmatter.attributes)};`
}