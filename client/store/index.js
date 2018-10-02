import {TopicState} from './topic-state.js'

import {User} from './user.js'

export {
    // AppState,
    TopicState,
    User
}

// 用于服务端渲染
export const createStore = ()=>{
    return {
        user:new User(),
        // appState:new AppState(),
        topicState:new TopicState()
    }
}