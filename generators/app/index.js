/**
 * Copyright (c) 2009-2018 pandolajs.com, All rights reserved.
 * @fileoverview 前端脚手架
 * @author sizhao | sizhao@pandolajs.com
 * @version 1.0 | 2018-01-09 | sizhao       // 初始版本
 *
 * @description
 * generator-react-koa is a generator that can create a project which base on react and koa
 *
 * # Usage
 * > yo react-koa [projectName] [--mpa|--spa]
 *
 * the `projectName` argument and `--mpa` `--spa` flags are all optional.
 * notice the flag `--mpa` and `--spa` is mutually exclusive, you CAN NOT use them at the same time.
 */

const Generator = require('yeoman-generator')
const beautify = require('gulp-jsbeautifier')
const through = require('through2')
const path = require('path')

const headerComment =
`/**
 * Copyright (c) 2009-{year} pandolajs.com, All rights reserved.
 * @fileoverview {fileoverview}
 * @author {userName} | {userEmail}
 * @version 1.0 | {date} | {userName}       // 初始版本
 */
`

/**
 * match block comment which contain `@fileovervie` filed.
 * looks like below:
 */
/**
 * xxxxxxxx
 * @fileoverview  yyyyy
 * xxxxxxxx
 */
const commentRegWithFO = /(?:\/\*(?:[^*]|[\r\n]|(?:\*+(?:[^*/]|[\r\n])))*(?:\*+\s*@file[oO]verview((?:[^*/\r\n])+)[\r\n]*)(?:[^*]|[\r\n]|(?:\*+(?:[^*/]|[\r\n])))*\*+\/)/

function generateComment(obj){
  return headerComment.replace(/\{([^}]+)\}/mg, (m, $1) => {
    return obj[$1]
  })
}

function removeComment(content){
  let matched = 'generator-pandolajs-app init'
  const replacedContent = content.replace(commentRegWithFO, (m, $1) => {
    matched = $1
    return ''
  })

  return {
    matched,
    content: replacedContent
  }
}

module.exports = class extends Generator{
  constructor(args, opts){
    super(args, opts)

    // suport `yo react-koa <projectName>`
    this.argument('projectName', {
      desc: 'The project name that you want to create.', // used to show description when run command `yo react-koa --help`.
      required: false,
      type: String
    })

    // suport command line flag `--mpa`
    this.option('mpa', {
      desc: 'Specify the project that you are going to create is a multiple page application.',
      type: Boolean,
      alias: 'm'
    })

    // suport command line flag `--spa`
    this.option('spa', {
      desc: 'Specify the project that you are going to create is a single page application. ',
      type: Boolean,
      alias: 's'
    })

    const { mpa, spa } = this.options
    this.options.projectType = (mpa && !spa) ? 'mpa' : (!mpa && spa) ? 'spa' : ''
    if(mpa&spa){
      this.log(`\nI am confusing,\`--mpa\` and \`--spa\` is mutually exclusive, you CAN NOT use them at the same time.\n`)
    }
  }

  configuring(){
    const { userName, userEmail } = this.options
    const d = new Date
    const varMap = {
      userName,
      userEmail,
      year: d.getFullYear(),
      date: d.toLocaleDateString().replace('/', '-')
    }
    // only write header comment to .jsx? .less .css file
    this.registerTransformStream(through.obj(async function(file, encoding, callback){
      if(/\.(?:js|jsx|less|css)$/.test(file.extname)){
        let hcstr = ''

        if(file.isBuffer()){
          let contentStr = file.contents.toString('utf8')
          const {content, matched} = removeComment(contentStr)

          hcstr = generateComment(Object.assign(varMap, {fileoverview: matched}))
          const hcb = Buffer.from(hcstr)
          const contentBuff = Buffer.from(content)
          file.contents = Buffer.concat([hcb, contentBuff])
        }

        if(file.isStream()){
          this.contents.setEncoding('utf8')
          const contentStr = await new Promise(resolve => {
            this.contents.on('readable', () => {
              let result = ''
              let chunk
              while(null != (chunk = this.contents.read())){
                result += chunk
              }
              resolve(result)
            })
          })
          const { content, matched } = removeComment(contentStr)
          hcstr = generateComment(Object.assign(varMap, {fileoverview: matched}))
          const stream = through()
          stream.write(hcstr)
          stream.write(content)
          file.contents = stream
        }
      }

      this.push(file)
      callback()
    }))

    this.registerTransformStream(beautify({
      indent_size: 2
    }))
  }

  prompting(){
    const prompts = []
    const { projectName, mpa = false, spa = false } = this.options
    const storedConfig = this.config.getAll()
    const {userName, userEmail} = storedConfig

    if(mpa&spa || !(mpa|spa)){
      prompts.push({
        type: 'list',
        name: 'projectType',
        message: 'Please specify the project type you gona to create:',
        choices: [
          {
            name: 'multiple page application',
            value: 'mpa',
            short: 'mpa'
          },
          {
            name: 'single page application',
            value: 'spa',
            short: 'spa'
          }
        ],
        default: 'spa'
      })
    }

    !projectName && prompts.push({
      type: 'input',
      name: 'projectName',
      message: 'Please name your project:',
      default: `react-koa`
    })

    !userName && prompts.push({
      type: 'input',
      name: 'userName',
      message: 'Please input a user name:',
      default: ''
    })

    !userEmail && prompts.push({
      type: 'input',
      name: 'userEmail',
      message: 'Please input a user email:',
      default: ''
    })

    return this.prompt(prompts).then(anwsers => {
      const { userName = storedConfig.userName, userEmail = storedConfig.userEmail } = anwsers
      this.config.set('userName', userName)
      this.config.set('userEmail', userEmail)
      Object.assign(this.options, anwsers, {userName, userEmail})
    })
  }

  writing(){
    const { projectName, projectType } = this.options

    const templatePath = this.templatePath(`${projectType}/**/*`)
    const destinationPath = this.destinationPath(`${projectName}/`)
    const ejsPath = this.destinationPath(`${projectName}/**/*.ejs`)
    this.destPath = destinationPath
    this.fs.copy(templatePath, destinationPath, {
      globOptions: {
        dot: true
      }
    })

    const pkgTplPath = this.templatePath(`${projectType}/package.ejs`)
    const pkgDestPath = this.destinationPath(path.join(destinationPath, 'package.json'))
    this.fs.copyTpl(pkgTplPath, pkgDestPath, {projectName})

    this.fs.delete(ejsPath)
  }

  install(){
    process.chdir(this.destPath)
    this.installDependencies({
      npm: true,
      bower: false
    })
  }

  end(){
    const { projectName } = this.options
    const asciiWacai = this.fs.read(path.resolve(__dirname, '../../resource/ascii-pandolajs.txt'))
    this.log(`\n${asciiWacai}\n`)
    this.log(`Congratulation! Everything is ready, \`cd ${projectName}\` and enjoy your work.\n\n`)
  }
}
