import React from 'react';
import {Menu} from 'antd'
import style from './style.less'
import {withRouter} from 'react-router-dom'
import queryString from 'query-string'


class MenuBar extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            current:'all'
        }
        this.handleClick=this.handleClick.bind(this)
    }
    handleClick(e){
        this.setState({
            current: e.key,
        });
        this.props.history.push(`/Topic/TopicList?tab=${e.key}`)
    }

    render() {
        return (
            <div>
                <Menu
                    onClick={this.handleClick}
                    selectedKeys={[this.state.current]}
                    mode="horizontal"
                    style={{overflow: 'hidden'}}
                >
                    <Menu.Item key="all"  className={style.item}>
                        全部
                    </Menu.Item>
                    <Menu.Item key="share" className={style.item}>
                        分享
                    </Menu.Item>
                    <Menu.Item key="job"  className={style.item}>
                        工作
                    </Menu.Item>
                    <Menu.Item key="ask"  className={style.item}>
                        问答
                    </Menu.Item>
                    <Menu.Item key="good"  className={style.item}>
                        精品
                    </Menu.Item>
                    <Menu.Item key="dev"  className={style.item}>
                        测试
                    </Menu.Item>
                </Menu>
            </div>
        );
    }
    componentDidMount(){
        this.setState({
            current:this.getTab(this.props.location.search)
        })
    }
    getTab(str){
        if(!str){
            return 'all'
        }
        return queryString.parse(str).tab
    }
}

MenuBar=withRouter(MenuBar)

export default MenuBar;