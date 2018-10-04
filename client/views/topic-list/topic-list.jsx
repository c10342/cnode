import React from 'react';
import DataList from "../data-list/data-list";
import PropTypes from "prop-types";
import {inject, observer} from "mobx-react/index";
import queryString from 'query-string'

@inject(stores=>{
    return {
        topicState:stores.topicState
    }
})
@observer
class TopicList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <DataList topics={this.props.topicState.topics}/>
            </div>
        );
    }
    componentDidMount(){
        const tab = this.getTab(this.props.location.search)
        this.props.topicState.getTopicsData(tab).catch(()=>{
            this.props.history.push('/err')
        })
    }
    // 组件接收props参数时
    componentWillReceiveProps(newProps){
        if(newProps.location.search==this.props.location.search){
            return;
        }
        const tab = this.getTab(newProps.location.search)
        this.props.topicState.getTopicsData(tab).catch(()=>{
            this.props.history.push('/err')
        })
    }
    getTab(str){
        let search = queryString.parse(str)
        return search?search.tab:"all"
    }
}

// mobx注入的props用TopicList.wrappedComponent.proptypes
TopicList.wrappedComponent.proptypes={
    topicState:PropTypes.object.isRequired
}

export default TopicList;