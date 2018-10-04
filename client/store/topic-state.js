// 把获取回来的topics数据变成对象，方便我们使用
import {extendObservable, observable,action,computed,toJS} from "mobx/lib/mobx";
import {get,post} from "../util/https";

class Topic{
    constructor(data){
        // 使用mobx提供的方法将data绑定在this上才能触发视图更新
        extendObservable(this,data)
    }
}

export class TopicState{
    @observable topics
    @observable isLoading
    @observable topDetail
    @observable repliesArr
    constructor({topics,isLoading,topDetail,repliesArr}={topics:[],isLoading:false,topDetail:[],repliesArr:[]}){
        this.topics=topics.map(item=>new Topic(item))
        this.topDetail=topDetail
        this.isLoading=isLoading
        this.repliesArr=repliesArr
    }

    @computed get TopDetail(){
        return this.topDetail
    }


    @action getTopDetail(id){
        this.isLoading=true
        this.topDetail=[]
        return new Promise((resolve, reject) => {
            get(`/topic/${id}`,{mdrender:false}).then(res=>{
                if(res.success){
                    this.repliesArr=res.data.replies.reverse()
                    this.topDetail=res.data
                }
                this.isLoading=false
                resolve()
            }).catch(err=>{
                this.isLoading=false
                reject()
            })
        })

    }

    @action getTopicsData(tab){
        this.isLoading=true
        this.topics=[]
        return new Promise((resolve, reject) => {
            get('/topics',{mdrender:false,tab}).then(res=>{
                if(res.success){
                    this.topics=res.data.map(item=>new Topic(item))
                }
                this.isLoading=false
                resolve()
            }).catch(err=>{
                this.isLoading = false;
                reject()
            })
        })
    }

    @action replies(accessToken,content,id){
        return new Promise((resolve, reject) => {
            post(`/topic/${this.topDetail.id}/replies`,{},{accesstoken:accessToken,content}).then(res=>{
                get(`/topic/${id}`,{mdrender:false}).then(res=>{
                    if(res.success){
                        this.repliesArr=res.data.replies.reverse()
                        resolve()
                    }
                }).catch(err=>{
                    reject(err);
                })
            }).catch((err)=>{
                reject()
            })
        })
    }
    @action createTopic(title,content,accesstoken){
        return new Promise((resolve, reject) => {
            post('/topics',{},{title,content,accesstoken,tab:'dev'}).then(res=>{
                resolve(res)
            }).catch(reject)
        })
    }
    toJson(){
        return {
            topics:toJS(this.topics),
            isLoading:this.isLoading,
            topDetail:toJS(this.topDetail),
            repliesArr:toJS(this.repliesArr),
        }
    }
}

// {
//     id:userId,
//         author:{
//     loginname,
//         avatar_url
// },
//     last_reply_at,
//         title:content
// }