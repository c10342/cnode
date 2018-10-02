import React from 'react';
import style from './style.less'
import {Button,Input,Icon} from 'antd'
import {inject,observer} from 'mobx-react'
import PropTypes from 'prop-types'

@inject(stores => {
    return {
        user:stores.user
    }
})
    @observer
class UserLogin extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            accesstoken:'',
            msg:''
        }
    }

    render() {
        return (
            <div>
                <div className={style.bg}>
                    {/*<img src={bg} style={{with:80,height:80,borderRadius:"50%"}} />*/}
                        <div>
                            <Icon type="user" theme="outlined" style={{fontSize:60}} />
                        </div>
                    <span>未登录</span>
                </div>
                <div className={style['login-container']}>
                    <div className={style.input}>
                        <Input value={this.state.accesstoken} placeholder="accesstoken" onChange={(e)=>{this.handleChange(e)}} />
                        {this.state.msg?<span style={{color:"red",magin:"10px 0"}}>{this.state.msg}</span>:null}
                        <Button type='primary' block onClick={()=>{this.login()}}>登录</Button>
                    </div>
                    <p>
                        请前往 <a href="http://cnodejs.org">cnode</a> 点击右上角注册，使用github账号登录之后点击右上角设置，在页面最下方可以获取access_token
                    </p>
                </div>
            </div>
        );
    }
    login(){
        this.setState({
            msg:''
        })
        let accesstoken=this.state.accesstoken.trim()
        if(!accesstoken){
            this.setState({
                msg:'请输入accesstoken'
            })
        }else{
            this.props.user.login(accesstoken).then(()=>{
                this.props.history.replace('/user/info')
            }).catch(()=>{
                this.setState({
                    msg:'服务器发生错误'
                })
            })
        }
    }
    handleChange(e){
        this.setState({
            accesstoken:e.target.value
        })
    }
}

UserLogin.wrappedComponent.proptypes={
    user:PropTypes.object.isRequired
}

export default UserLogin;