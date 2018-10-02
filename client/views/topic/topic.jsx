import React from 'react';
import Loading from '../loading/loading.jsx'
import MenuBar from '../menu-bar/menu-bar.jsx'
import {inject, observer} from "mobx-react/index";
import TopicList from "../topic-list/topic-list";
import {Route,Redirect} from 'react-router-dom'
import PropTypes from "prop-types";


@inject(stores=>{
    return {
        topicState:stores.topicState
    }
})
@observer
class Topic extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <MenuBar/>
                {this.props.topicState.isLoading?<Loading/>:null}
                <Route key='/Topic' path='/Topic' render={()=><Redirect to='/Topic/TopicList' />} exact />,
                <Route key='/Topic/TopicList' path='/Topic/TopicList' component={TopicList} />,
            </div>
        );
    }
}

Topic.wrappedComponent.proptypes={
    topicState:PropTypes.object.isRequired
}

export default Topic;