import React from 'react';
import {Icon} from 'antd';
import style from './style.less'
import {withRouter} from 'react-router-dom'
import {inject,observer} from 'mobx-react'

@inject(stores => {
    return {
        user:stores.user
    }
})
    @observer
class TabBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={style.container}>
                <div className={style["inner-container"]}>
                    <div onClick={()=>{this.handleClick()}}>
                        <Icon type="home" theme="filled" style={{fontSize:22,color: 'black'}} />
                        <span className={style.title}>cnode</span>
                    </div>
                    <div>
                        {this.props.user.isLogin?<button onClick={()=>this.createTopic()} className={style.reply}>新建话题</button>:null}
                        <button className={style.button}
                                onClick={()=>{this.login()}}>
                            {this.props.user.isLogin?this.props.user.userInfo.loginname:'登录'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    login(){
        if(this.props.location.pathname=='/user/login'){
            return;
        }
        if(this.props.user.isLogin){
            this.props.history.push('/user/info')
        }else{
            this.props.history.push('/user/login')
        }
    }
    handleClick(){
        if(this.props.location.pathname=='/Topic/TopicList'){
            return;
        }
        this.props.history.push('/Topic/TopicList')
    }
    createTopic(){
        if(this.props.location.pathname=='/TopicCreate'){
            return;
        }
        this.props.history.push('/TopicCreate')
    }
}

TabBar=withRouter(TabBar)

export default TabBar;