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

const serverRender = require('./util/server-render.js')

const isDev = process.env.NODE_ENV=='development'

app.use(favicon(path.join(__dirname,'../favicon.ico')))

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: false }))

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    maxAge:10*60*1000
}))

// 请求必须在服务器渲染之前
app.use('/api/user',login)
app.use('/api',proxy)

// 处理请求css文件
const  csshook = require('css-modules-require-hook/preset.js')
// 处理图片等其他资源
const  assethook = require('asset-require-hook')
// 配置参数
assethook({
    extensions: ['jpg','png']
});

if(!isDev){

    const serverEntry = require('../dist/server-entry.js');

    const templateHtml = fs.readFileSync(path.join(__dirname,'../dist/server-template.ejs'),'utf8')


    app.use('/public',express.static(path.join(__dirname,'../dist')))

    app.get('*',function (req,res) {

        serverRender(serverEntry,templateHtml,req,res)
    })
}else{ //开发环境
    const devStatic = require('./util/dev-static.js')
    devStatic(app)
}

// express的错误中间件，必须写齐4个参数，他是根据参数的长度来判断是否为错误中间件
app.use(function(error,req,res,next){
    res.status(500).send(error)
})


const port = process.env.PORT || 9000;

const host = process.env.HOST || '0.0.0.0'

app.listen(port,host,function () {
    console.log("http://localhost:9000")
})

// accesstoken:54033715-3491-410e-a95e-567516aab280
