const path = require('path')
const htmlPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
// 这是一个webpack官方提供的插件，用于合并webpack配置
const webpackMerge = require('webpack-merge')

const NameAllModulesPlugin = require('name-all-modules-plugin')

const webpackBaseConfig = require('./webpack.config.base.js')

const cdnConfig = require('../app.config.js').cdn

// const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

// "dev:client":"cross-env NODE_ENV=development webpack-dev-server --config ./build/webpack.config.client.js"
const isDev = process.env.NODE_ENV=='development'

const config=webpackMerge(webpackBaseConfig,{
    entry: {
        app:path.join(__dirname,'../client/client-entry.js')
    },
    output: {
        filename: "[name].[hash].js",
        // 这里开启模块热更新后必须/public后面必须加上/,否则不能实现热更新,坑
        publicPath: "/public/"
    },
    plugins: [
        new htmlPlugin({
            template:path.join(__dirname,'../client/template.html')
        }),
        // 用于服务端渲染
        new htmlPlugin({
            // ejs-compiled-loader解析ejs
            template:'!!ejs-compiled-loader!'+path.join(__dirname,'../client/server-template.ejs'),
            filename:'server-template.ejs'
        })
    ]
})

if(isDev){
    // 调试源代码
    config.devtool="#cheap-module-eval-source-map"
    config.entry={
        app:[
            // 客户端模块热更新所需要的
            "react-hot-loader/patch",
            path.join(__dirname,'../client/client-entry.js')
        ]
    }
    config.devServer={
        // 0.0.0.0代表这台电脑，127.0.0.1或者localhost或者电脑的ip地址都能访问到
        host:'0.0.0.0',
        port:8888,
        // 相当于在path.join(__dirname,'../dist')目录下开启了一个静态资源服务器
        contentBase:path.join(__dirname,'../dist'),
        // 所有资源都要以/public开头，跟output中的publicPath对应
        publicPath:'/public',
        // 服务端渲染必须开启
        historyApiFallback:{
            // 所有404的请求都会返回index.html
            index:'/public/index.html'
        },
        // 编译过程中产生的错误或者其他的都会在页面上显示
        overlay:{
            // 只显示错误信息
            errors:true
        },
        // 开启模块热更新，需要配置热更新才能开启
        hot:true,
        proxy:{
            '/api':'http://localhost:9000'
        },
        // 打开浏览器
        // open:true
    }
    // webpack模块热更新插件
    config.plugins.push(new webpack.HotModuleReplacementPlugin())
}else{
    config.entry = {
        app: path.join(__dirname, '../client/client-entry.js'),
        vendor: [
            'react',
            'react-dom',
            'react-router-dom',
            'mobx',
            'mobx-react',
            'axios',
            'query-string',
            'dateformat',
            'marked',
            'antd',
            "react-helmet",
            "prop-types"
        ]
    }
    config.output.filename = '[name].[chunkhash].js'
    // config.output.publicPath=cdnConfig.host
    config.plugins.push(
        // 混淆压缩js代码
        // new webpack.optimize.UglifyJsPlugin(),
        // new UglifyJSPlugin(),
        // 提取第三方库
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor'
        }),
        // webpack生成出来的代码，每次生成出来的都不一样
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            minChunks: Infinity
        }),
        // 模块命名，使用模块名命名，因为使用id命名的时候，每次打包出来的文件的id可能不一样，导致长缓存失效，特别是在异步加载文件的时候改变某一个文件就会改变所有的文件名，导致长缓存失效
        new webpack.NamedModulesPlugin(),
        // 解决webpack用名字命名是可能会带来的一些冲突
        new NameAllModulesPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),

        // webpack打包出来的chunk可能也会没有名字,导致使用数字命名,长缓存失效
        new webpack.NamedChunksPlugin((chunk) => {
            if (chunk.name) {
                return chunk.name
            }
            return chunk.mapModules(m => path.relative(m.context, m.request)).join('_')
        })
    )
}


module.exports=config