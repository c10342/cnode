const axios = require('axios')

const webpack = require('webpack')

const path = require('path')

// express的一个中间件，用来代理请求转发
const proxy = require('http-proxy-middleware')

// 文件读写，这个memory-fs是操作内存中的文件的，而node自带的fs是操作硬盘的
const memoryFs = require('memory-fs')

const ReactDomSsr = require('react-dom/server.js')

// 用于在服务端渲染时执行react中的一些异步方法
const bootstrapper = require('react-async-bootstrapper')

const ejs = require('ejs')

// 用于序列化javascript对象
const serialize = require('serialize-javascript')

const Helmet = require('react-helmet').default

const serverConfig = require('../../build/webpack.config.server.js');

// 获取生成模板html文件，这里因为webpack在开发环境生成的东西是在内存中，所以无法直接读取内存中的东西，webpack在开发环境时会自动生成一个静态资源服务器，我们可以通过访问该服务器去获取生成的html模板文件
const getTemplateHtml = ()=>{
    return new Promise((resolve,reject)=>{
        axios.get('http://localhost:8888/public/server-template.ejs')
            .then(res=>{
                resolve(res.data)
            })
            .catch(reject)
    })
}

const mfs = new memoryFs


// 由于我们不在打包第三方的包，所以我们不用这种方式引入模块
// const Module = module.constructor

const NativeModule = require('module')
const vm = require('vm')
// 我们要执行字符串代码首先需要引入里面的模块，因为我们不在把第三方的包打包在一起
const getModuleFromString=(bundle,filename)=>{
    const m={exports:{}}

    // 把字符串代码变成(function(exports, require, module, __finename, __dirname){ ...bundle code })这种形式
    const wrapper = NativeModule.wrap(bundle)

    // 执行代码
    const script = new vm.Script(wrapper,{
        filename,
        displayErrors:true
    })

    // 执行的上下文
    const result = script.runInThisContext()

    // 字符串中require的东西都会在m中
    result.call(m.exports,m.exports,require,m)

    return m;

}

let serverEntryJs;

let createStore;

// 这是webpack给我们提供在node环境下的服务，相当于直接在命令行中启动webpack
const webpackCompiler = webpack(serverConfig)

// webpack默认生成的东西输出到硬盘上的，这里我们把webpack生成的东西输出到内存中，这样读写更快，否则每次更改文件时我们都要等待一段时间
webpackCompiler.outputFileSystem = mfs

// 监听webpack的entry入口文件的变化，第一个参数是配置选项
webpackCompiler.watch({},function(err,status){
    //err打包时出现的错误信息,statue是打包时输出的信息
    if(err) throw new Error()
    status = status.toJson()

    status.errors.forEach(error=>console.log(error))
    status.warnings.forEach(warning=>console.log(warning))

    // 获取生成的bundle文件路径
    const bundlePath = path.join(
        serverConfig.output.path,
        serverConfig.output.filename
    )

    // 读取出来的是字符串,不能直接使用
    const bundle = mfs.readFileSync(bundlePath,'utf-8')

    // 由于我们不在打包第三方的包，所以我们不用这种方式引入模块
    // const m = new Module()
    // 这里我们借助module把bundle变成一个模块,第二个参数是模块名
    // m._compile(bundle,'server-entry.js')

    const m = getModuleFromString(bundle,'server-entry.js')

    // 获取模块中的内容
    serverEntryJs = m.exports.default;

    createStore=m.exports.createStore
})

const getStore = (stores)=>{
    return Object.keys(stores).reduce((result,storeName)=>{
        result[storeName]=stores[storeName].toJson()
        return result
    },{})
}



module.exports=function (app) {
    // 请求静态资源
    app.use('/public',proxy({
        target:'http://localhost:8888'
    }))

    app.get('*',function(req,res){
        getTemplateHtml().then(template=>{
            const routerContext={}
            const stores=createStore()
            const app = serverEntryJs(stores,routerContext,req.url)


            // const content = ReactDomSsr.renderToString(app)
            // // 必须在renderToString之后才能获取routerContext
            // // 如果router中有Redirect,则会在routerContext中保存其url
            // if(routerContext.url){
            //     // 在服务器自动重定向
            //     res.status(302).setHeader('Location',routerContext.url)
            //     res.end()
            //     return;
            // }
            // const html  = template.replace('<!-- app -->',content)
            // res.send(html)

            // 执行react中的asyncBootstrap异步方法
            bootstrapper(app).then(()=>{
                // 这个时候已经可以拿到routerContext
                if(routerContext.url){
                    // 在服务器自动重定向
                    res.status(302).setHeader('Location',routerContext.url)
                    res.end()
                    return;
                }

                // 会自动获取react组件中Helmet标签中的内容
                const helmet = Helmet.rewind()

                // 获取store
                const store = getStore(stores)
                const content = ReactDomSsr.renderToString(app)

                // 传递进去的数据有就渲染出来，没有就不渲染出来
                const ejsHtml = ejs.render(template,{
                    appString:content,
                    initialState:serialize(store),
                    meta:helmet.meta.toString(),
                    title:helmet.title.toString(),
                    style:helmet.style.toString(),
                    link:helmet.link.toString()
                })

                // const html  = template.replace('<!-- app -->',content)
                res.send(ejsHtml)
            })
        })
    })
}