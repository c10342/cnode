import React from 'react';
import { List, Avatar } from 'antd';
import style from './style.less'
import {withRouter} from 'react-router-dom'
import queryString from "query-string";

class DataList extends React.Component {
    constructor(props) {
        super(props);
        this.handelClick=this.handelClick.bind(this)
        this.state={
            share:{
                name:"分享",
                bgColor:"#03A9F4"
            },
            ask:{
                name:"问答",
                bgColor:"#03A9F4"
            },
            job:{
                name:"工作",
                bgColor:"#03A9F4"
            },
            good:{
                name:"精品",
                bgColor:"#D81B60"
            },
            all:{
                name:"全部",
                bgColor:"#03A9F4"
            },
            dev:{
                name:"测试",
                bgColor:"#03A9F4"
            }
        }
    }

    render() {
        return (
                <List
                    bordered={false}
                    itemLayout="horizontal"
                    dataSource={this.props.topics}
                    renderItem={item => (
                        <List.Item className={style.container} style={{borderBottom: 0}} onClick={()=>{this.handelClick(item)}}>
                            <List.Item.Meta
                                avatar={<Avatar src={item.author.avatar_url} />}
                                title={this.renderTitle(item)}
                                description={this.renderDesc(item)}
                            />
                        </List.Item>
                    )}
                />
        )
    }
    renderTitle(item){
        if(!item) {
            return null;
        }
        const pathname=this.props.location.pathname
        const type=this.getTab(this.props.location.search)
        const tab = this.state[type]
        const setTop = <span style={{backgroundColor:"#F48FB1"}}>置顶</span>
        const other = pathname=='/user/info'?<span style={{width:0,height:0}}></span>:<span style={{backgroundColor:tab['bgColor']}}>
            {item.tab?(this.state[item.tab]['name']):'其他'}
        </span>
        const good = <span style={{backgroundColor:'#D81B60'}}>精品</span>
        return (
            <div className={style.title}>
                {item.top?setTop:(item.good && type=='good')?good:other}
                <span>{item.title}</span>
            </div>
        )
    }
    renderDesc(item){
        let time = new Date(item.create_at || item.last_reply_at)
        const year = time.getFullYear()
        const month = time.getMonth()
        const date = time.getDate()
        return (
            <div className={style.description}>
                <span className={style.author}>{item.author.loginname}</span>
                {item.reply_count?<div className={style.num}>
                    <span>{item.reply_count}</span>
                    <span>/{item.visit_count}</span>
                </div>:null}
                <div className={style.time}>
                    <span>创建时间 :</span>
                    <span>{`${year}-${month}-${date}`}</span>
                </div>
            </div>
        )
    }
    getTab(str){
        if(!str){
            return 'all'
        }
        let search = queryString.parse(str)
        return search.tab
    }
    handelClick(item){
        this.props.history.push(`/TopicDetail/${item.id}`)
    }
}

DataList=withRouter(DataList)

export default DataList;