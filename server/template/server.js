const express = require('express')

const app = express()

const fs = require('fs')

const path = require('path')

const session = require('express-session')

const bodyParser = require('body-parser')

// 这是一个express插件，用于处理网页图标请求的
const favicon = require('serve-favicon')

// react-dom提供的服务端渲染，用于把jsx转换成html字符串
const ReactDomSsr = require('react-dom/server.js')

const login = require('./util/handle-login.js')

const proxy = require('./util/proxy.js')

const isDev = process.env.NODE_ENV=='development'

app.use(favicon(path.join(__dirname,'../favicon.ico')))

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    maxAge:10*60*1000
}))

// 请求必须在服务器渲染之前
app.use('/api/user',login)
app.use('/api',proxy)

if(!isDev){  //生产环境
    // 这里使用.default是因为../client/server-entry.js使用es6的export default模块规范，而这里是用commonjs的规范
    const serverEntry = require('../dist/server-entry.js').default;

    const templateHtml = fs.readFileSync(path.join(__dirname,'../dist/index.html'),'utf8')

// 处理资源和请求，以/publish开头的说明是请求静态资源
    app.use('/public',express.static(path.join(__dirname,'../dist')))

    app.get('*',function (req,res) {
        // 使用react-dom提供的renderToString方法使jsx变成字符串
        const appString = ReactDomSsr.renderToString(serverEntry)
        // 把template.html中的<!-- app -->替换成appString
        const html = templateHtml.replace('<!-- app -->',appString)
        res.send(html)
    })
}else{ //开发环境
    const devStatic = require('./util/dev-static.js')
    devStatic(app)
}



app.listen(9000,function () {
    console.log("http://localhost:9000")
})

// accesstoken:54033715-3491-410e-a95e-567516aab280
