import React from 'react'
import {Route,Redirect} from 'react-router-dom'
// import TopicDetail from '../views/topic-detail/index.jsx'
// import TopicList from '../views/topic-list/index.jsx'

// export default ()=>[
//     <Route path='/' render={()=><Redirect to='/TopicList' />} exact />,
//     <Route path='/TopicDetail' component={TopicDetail} />,
//     <Route path='/TopicList' component={TopicList} />
// ]
// exact精确匹配
// <Route path='/' component={TopicList} exact />

import Topic from '../views/topic/topic.jsx'
import TopicDetail from '../views/topic-detail/topic-detail.jsx'
import UserLogin from '../views/user-login/user-login.jsx'
import UserInfo from '../views/user-info/user-info.jsx'
import TopiucCreate from '../views/topic-create/topic-create.jsx'

export default ()=>[
    <Route key='/' path='/' render={()=><Redirect to='/Topic' />} exact />,
    <Route key='/Topic' path='/Topic' component={Topic} />,
    <Route key='/TopicDetail' path='/TopicDetail/:id' component={TopicDetail} exact />,
    <Route key='/user/login' path='/user/login' component={UserLogin} exact />,
    <Route key='/user/info' path='/user/info' component={UserInfo} exact />,
    <Route key='/TopicCreate' path='/TopicCreate' component={TopiucCreate} exact />,
]