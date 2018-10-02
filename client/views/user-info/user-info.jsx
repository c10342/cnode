import React from 'react';
import {inject,observer} from 'mobx-react'
import style from './style.less'
import {Row,Col} from 'antd'
import PropTypes from 'prop-types'
import DataList from '../data-list/data-list.jsx'
import Loading from '../loading/loading.jsx'

@inject(stores => {
    return {
        user:stores.user
    }
})
    @observer
class UserInfo extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {userInfo,detail,isLoading} = this.props.user
        return (
            <div>
                <div className={style.bg}>
                    <img src={userInfo.avatar_url} style={{with:80,height:80,borderRadius:"50%"}} />
                    <span>{userInfo.loginname}</span>
                </div>
                {isLoading?<Loading/>:(
                    <div className={style.list}>
                        <Row type="flex" justify="space-around">
                            <Col xs={{ span: 24 }} lg={{ span: 24 }} className={style.col}>
                                <h3>最近发布的话题</h3>
                                <DataList topics={detail.recentTopics}/>
                            </Col>
                            <Col xs={{ span: 24 }} lg={{ span: 24 }} className={style.col}>
                                <h3>新的回复</h3>
                                <DataList topics={detail.recentReplies}/>
                            </Col>
                            <Col xs={{ span: 24 }} lg={{ span: 24}} className={style.col}>
                                <h3>收藏的话题</h3>
                                <DataList topics={detail.topicCollect}/>
                            </Col>
                        </Row>
                    </div>
                )}
            </div>
        );
    }
    componentDidMount(){
        if(!this.props.user.isLogin){
            this.props.history.replace('/user/login')
            return;
        }
        this.props.user.getDetail()
        this.props.user.topicCollect()
    }
}

UserInfo.wrappedComponent.proptypes={
    user:PropTypes.object.isRequired
}

export default UserInfo;