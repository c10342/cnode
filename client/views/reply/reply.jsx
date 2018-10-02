import React from 'react';
import marked from "marked";
import dateFormat from "dateformat";
import {List,Avatar} from 'antd'
import style from './style.less'

class Reply extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={style.container}>
                <List
                    itemLayout="horizontal"
                    dataSource={this.props.data}
                    renderItem={item => (
                        <List.Item style={{padding:"10px 20px"}}>
                            <List.Item.Meta
                                avatar={<Avatar src={item.author.avatar_url} />}
                                title={this.renderTitle(item)}
                                description={<div className={style.reply} dangerouslySetInnerHTML={{__html:marked(item.content)}}></div>}
                            />
                        </List.Item>
                    )}
                />
            </div>
        );
    }
    renderTitle(item){
        return (
            <div className={style.author}>
                <span>{item.author.loginname}</span>
                <span>{dateFormat(item.create_at,'yyyy-mm-dd')}</span>
            </div>
        )
    }
}

export default Reply;