import React from 'react';
import {Input,Icon,Button,Radio} from 'antd'
import style from './style.less'
import {inject,observer} from 'mobx-react'
import PropTypes from 'prop-types'

const { TextArea } = Input;
const RadioGroup = Radio.Group;

class TopicCreate extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            title:'',
            content:'',
            value:'dev'
        }
    }

    render() {
        return (
            <div className={style.container}>
                <Input
                    placeholder="请输入标题"
                    prefix={<Icon type="meh" theme="outlined" style={{ color: 'rgba(0,0,0,.25)'}} />}
                    onChange={(e)=>{this.handleTitle(e)}}
                />
                <div style={{height:30}}></div>
                <TextArea
                    rows={6}
                    placeholder='请输入内容'
                    onChange={(e)=>{this.handleContent(e)}}
                />
                <div style={{height:30}}></div>
                <RadioGroup onChange={this.onChange} value={this.state.value}>
                    <Radio style={{margin:"0 10px"}} value='share'>分享</Radio>
                    <Radio style={{margin:"0 10px"}} value='job'>工作</Radio>
                    <Radio style={{margin:"0 10px"}} value='ask'>问答</Radio>
                    <Radio style={{margin:"0 10px"}} value='dev'>测试</Radio>
                </RadioGroup>
                <div style={{height:30}}></div>
                <Button onClick={()=>this.handleClick()} type='primary'>回复</Button>
                <div style={{height:30}}></div>
                <div style={{color:"red"}}>
                    所有话题都会被发布到测试tab下
                </div>
            </div>
        );
    }
    handleTitle(e){
       this.setState({
           title:e.target.value
       })
    }
    handleContent(e){
        this.setState({
            content:e.target.value
        })
    }
    handleClick(){

        this.props.topicState.createTopic(this.state.title,this.state.content,this.props.user.accessToken).then(res=>{
            this.props.history.push(`/TopicDetail/${res.topic_id}`)
        })
    }
    componentDidMount(){
        if(!this.props.user.isLogin){
            this.props.history.push('/user/login')
        }
    }
    onChange = (e) => {
        this.setState({
            value: e.target.value,
        });
    }
}

TopicCreate=inject((stores)=>{
    return {
        topicState:stores.topicState,
        user:stores.user
    }
})(observer(TopicCreate))

TopicCreate.wrappedComponent.proptypes={
    topicState:PropTypes.object.isRequired,
    user:PropTypes.object.isRequired
}

export default TopicCreate;