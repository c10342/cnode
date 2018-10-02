// 客户端入口

import React from 'react';

import ReactDom from 'react-dom';

import App from './views/App.jsx'

import {AppContainer} from 'react-hot-loader';

import {BrowserRouter} from 'react-router-dom'

import {Provider} from 'mobx-react'

import {TopicState,User} from './store/index.js'

// 在这里我们使用的是react16，如果使用了服务端渲染需要用hydrate而不是render，这两者在react16没什么区别，但是render可能会在react17中被停用
// ReactDom.hydrate(<App/>,document.getElementById('root'))

// ReactDom.render(<App/>,document.getElementById('root'))


// 开启模块热更新

const root =document.getElementById('root');

const initialState=window.__INITIAL__STATE || {}

// const appState=new AppState(initialState.appState)

const topicState = new TopicState(initialState.topicState)

const user = new User(initialState.user)

// react-hot-loader需要在组件最外层包裹上一层AppContainer
const render = Component=>{
    ReactDom.hydrate(
        <AppContainer>
            <Provider topicState={topicState} user={user}>
                <BrowserRouter>
                    <Component/>
                </BrowserRouter>
            </Provider>
        </AppContainer>,
        root
    )
}

render(App)

if(module.hot){
    module.hot.accept('./views/App.jsx',()=>{
        const NextApp = require('./views/App.jsx').default
        render(NextApp)
    })
}