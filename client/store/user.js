import {observable,action,toJS} from 'mobx'
import {post,get} from '../util/https.js'

export class User{
    @observable userInfo
    @observable isLogin
    @observable detail
    @observable isLoading
    @observable accessToken

    constructor({userInfo={},isLogin=false,detail={},isLoading=false,accessToken=''}={}){
        this.userInfo=userInfo
        this.isLogin=isLogin
        this.detail=detail
        this.isLoading=isLoading
        this.accessToken=accessToken
    }

    @action login(accessToken){
        this.isLoading=true
        return new Promise((resolve,reject)=>{
            post('/user/login',{},{accessToken}).then(res=>{
                if(res.success){
                    this.userInfo=res
                    this.isLogin=true
                    this.isLoading=false
                    this.accessToken=accessToken
                    resolve()
                }else{
                    this.isLoading=false
                    reject()
                }
            }).catch(err=>{
                this.isLoading=false
                reject(err)
            })
        })
    }

    @action getDetail(){
        this.isLoading=true
        get(`/user/${this.userInfo.loginname}`).then(res=>{
            this.detail.recentTopics=res.data.recent_topics
            this.detail.recentReplies=res.data.recent_replies
            this.isLoading=false
        }).catch(err=>{
            this.isLoading=false
            console.log(err)
        })
    }

    @action topicCollect(){
        this.isLoading=true
        get(`/topic_collect/${this.userInfo.loginname}`).then(res=>{
            this.detail.topicCollect=res.data
            this.isLoading=false
        }).catch(err=>{
            this.isLoading=false
            console.log(err)
        })
    }

    toJson(){
        return {
            userInfo:toJS(this.userInfo),
            isLogin:this.isLogin,
            detail:toJS(this.detail),
            isLoading:this.isLoading,
            accessToken:toJS(this.accessToken)
        }
    }
}