// 服务端入口
// 把服务端需要渲染的东西导出去

import React from 'react';

// StaticRouter是react-router-dom提供的服务端静态路由渲染
import {StaticRouter} from 'react-router-dom'

// useStaticRendering适用于服务端渲染的
import {Provider,useStaticRendering} from 'mobx-react'

import App from './views/App.jsx'

import {createStore} from './store/index.js'

// 防止mobx在客户端时重复改变数据
useStaticRendering(true)

// context={routerContext}存放一些静态路由信息，url请求的url
export default  (stores,routerContext,url)=>{
    return (
        <Provider {...stores}>
            <StaticRouter context={routerContext} location={url}>
                <App/>
            </StaticRouter>
        </Provider>
    )
}

export {createStore}