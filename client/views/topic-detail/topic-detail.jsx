import React from 'react';

// 把marked语法转化成html
import marked from 'marked'

import PropTypes from 'prop-types'

import {inject,observer} from 'mobx-react'

import {Button,message,Input} from 'antd'

import dateFormat from 'dateformat'

import Loading from '../loading/loading.jsx'

import Reply from '../reply/reply.jsx'

import style from './style.less'

const { TextArea } = Input;

@inject(stores => {
    return {
        topicState:stores.topicState,
        user:stores.user
    }
})
@observer
class TopicDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            newReply:''
        }
    }

    render() {
        const topDetail=this.props.topicState.topDetail
        let content=topDetail.content
        let data = this.props.topicState.repliesArr
        return (
            <div ref={(e)=>this.div=e}>
                {this.props.topicState.isLoading?<Loading/>:(
                    <div>
                        <div className={style.container}>
                            <h3 className={style.h3}>{topDetail.title}</h3>
                            <div className={style.content}>
                                {content?<p dangerouslySetInnerHTML={{__html:marked(content)}}></p>:null}
                            </div>
                        </div>
                        <div className={style.reply}>
                            {content?(
                                <div>
                                    <div className={style['reply-header']}>
                                        <span>{topDetail.reply_count}条回复</span>
                                        <span>最新回复 {dateFormat(topDetail.last_reply_at,'yyyy-mm-dd')}</span>
                                    </div>
                                    <div className={style.btn}>
                                        {this.props.user.isLogin?(
                                            <div>
                                                <TextArea
                                                    rows={6}
                                                    placeholder='请输入评论'
                                                    onChange={(e)=>{this.handleNewReplyChange(e)}}
                                                />
                                                <div style={{height:30}}></div>
                                                <Button type="primary" onClick={()=>{this.reply()}}>回复</Button>
                                            </div>
                                        ):<Button type="primary" onClick={()=>{this.login()}}>登录进行回复</Button>}

                                    </div>
                                </div>
                            ):null}
                            <Reply data={data} />
                        </div>
                    </div>
                )}
            </div>
        )
    }

    handleNewReplyChange(e){
        this.setState({
            newReply:e.target.value
        })
    }

    reply(){
        if(!this.state.newReply){
            message.error('内容不能为空')
            return
        }
        const hide = message.loading('发表中', 0);
        const user = this.props.user
        const accessToken = user.accessToken
        this.props.topicState.replies(accessToken,this.state.newReply,this.props.match.params.id).then(()=>{
            hide()
            message.success('发表成功')
        }).catch(err=>{
            console.log(err)
            hide()
            message.error('发表失败')
        })
    }

    componentDidMount(){
        message.config({
            getContainer:()=>this.div,
        });
        const id = this.props.match.params.id
        this.props.topicState.getTopDetail(id).catch(()=>{
            this.props.history.push('/err')
        })
    }
    login(){
        this.props.history.push('/user/login')
    }
}

TopicDetail.wrappedComponent.proptypes={
    topicState:PropTypes.object.isRequired,
    user:PropTypes.object.isRequired
}

export default TopicDetail;