const path = require('path')
// const htmlPlugin = require('html-webpack-plugin')
const webpackMerge = require('webpack-merge')

const webpack = require('webpack')

const webpackBaseConfig = require('./webpack.config.base.js')

module.exports=webpackMerge(webpackBaseConfig,{
    // 打包目标
    target: "node",
    entry: {
        app:path.join(__dirname,'../client/server-entry.js')
    },
    output: {
        // 这里filename不用[name].[hash].js是因为服务端渲染需要用到该文件，使用[name].[hash].js后文件名难找
        filename: "server-entry.js",
        publicPath: "",
        // 打包后使用的模块化规范
        libraryTarget: "commonjs2"
    },
    // 这里我们只打包我们的业务代码，不打包第三方的包,即不需要打包的包
    externals:Object.keys(require('../package.json').dependencies),
    plugins: [
        // 服务端渲染不需要生成html
        // new htmlPlugin()

        // 打包的时候传递参数，这是是因为是在服务器中运行，所以请求的地址需要访问本主机
        new webpack.DefinePlugin({
            "process.env.API_BASE":'"http://127.0.0.1:9000"'
        })
    ]
})