import {observable,computed,action,autorun} from 'mobx'


// 不使用服务端渲染
// 采用装饰器模式
// class AppState{
//     // store
//     @observable name = '张三'
//     @observable count = 0
//
//     // 计算属性(getters)
//     @computed get msg(){
//         return `${this.name} say count is ${this.count}`
//     }
//
//     // action，负责修改store
//     @action add(){
//         this.count+=1
//     }
//     @action changeName(name){
//         this.name=name
//     }
// }
//
// const appState = new AppState()

// 每次数据变化都会触发这个回调函数
// autorun(()=>{
//     console.log(appState.msg)
// })


export class AppState{
    constructor({name,count}={name:'张三',count:0}){
        this.name=name
        this.count=count
    }
    // store
    @observable name
    @observable count

    // 计算属性(getters)
    @computed get msg(){
        return `${this.name} say count is ${this.count}`
    }

    // action，负责修改store
    @action add(){
        this.count+=1
    }
    @action changeName(name){
        this.name=name
    }

    toJson(){
        return {
            name:this.name,
            count:this.count
        }
    }
}


