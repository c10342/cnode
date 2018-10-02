const axios = require('axios')

const webpack = require('webpack')

const path = require('path')

const proxy = require('http-proxy-middleware')

const memoryFs = require('memory-fs')

const serverConfig = require('../../build/webpack.config.server.js');

const serverRender = require('./server-render.js')

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

const NativeModule = require('module')

const vm = require('vm')

const getModuleFromString=(bundle,filename)=>{
    const m={exports:{}}

    const wrapper = NativeModule.wrap(bundle)

    const script = new vm.Script(wrapper,{
        filename,
        displayErrors:true
    })

    const result = script.runInThisContext()

    result.call(m.exports,m.exports,require,m)

    return m;

}

let serverEntryJs;

const webpackCompiler = webpack(serverConfig)


webpackCompiler.outputFileSystem = mfs

webpackCompiler.watch({},function(err,status){
    if(err) throw new Error()
    status = status.toJson()

    status.errors.forEach(error=>console.log(error))
    status.warnings.forEach(warning=>console.log(warning))

    const bundlePath = path.join(
        serverConfig.output.path,
        serverConfig.output.filename
    )

    const bundle = mfs.readFileSync(bundlePath,'utf-8')

    const m = getModuleFromString(bundle,'server-entry.js')

    serverEntryJs = m.exports
})




module.exports=function (app) {
    app.use('/public',proxy({
        target:'http://localhost:8888'
    }))

    app.get('*',function(req,res,next){
        getTemplateHtml().then(template=>{
          return serverRender(serverEntryJs,template,req,res)
        }).catch(next) //因为上面return的是serverRender的promise，所以捕获的是serverRender的错误
    })
}