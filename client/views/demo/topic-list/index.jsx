import React from 'react';

import {inject,observer} from 'mobx-react'

import PropTypes from 'prop-types'

// react的一个组件，用于在服务端渲染时的seo
import Helmet from 'react-helmet'

import style from './style.less'

// inject告诉组件要注入到props中的东西，observer告诉组件一旦appState中的数据发生变化就更新视图
@inject('appState') @observer
class TopicList extends React.Component {
    constructor(props) {
        super(props);
        this.changeName=this.changeName.bind(this)
    }
    changeName(e){
        // 触发action
        this.props.appState.changeName(e.target.value)
    }
    render() {
        return (
            <div>
                {/*用于服务端渲染,head标签里面的东西都可以在这里面写*/}
                <Helmet>
                    <meta name='descript' content='this is ssr'/>
                    <meta name='auto' content='c10342'/>
                    <title>react ssr</title>
                </Helmet>
                <input type="text" onChange={this.changeName}/>
                <div className={style.title}>{this.props.appState.msg}</div>
            </div>
        );
    }
    // 该函数用于在服务器渲染时执行异步代码，服务器会调用该方法执行
    bootstrap(){
        return new  Promise((resolve)=>{
            setTimeout(()=>{
                this.props.appState.count=5

                // 这里必须返回true，否则react-async-bootstrapper不知道该函数有没有执行完毕
                resolve(true)
            },2000)
        })
    }
}

TopicList.proptypes={
    appState:PropTypes.object.isRequired
}

export default TopicList;