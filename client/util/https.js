import axios from 'axios'

const apiBase=process.env.API_BASE || ''

export const get =(url,params)=>{
    return new Promise((resolve,reject)=>{
        axios.get(`${apiBase}/api${url}`,{
            params
        }).then(res=>{
            if(res.status==200 && res.data.data.success){
                resolve(res.data.data)
            }else{
                reject(res.data)
            }
        }).catch(reject)
    })
}

const httpUrl=(url,params)=>{
    let str = ''
    for(let key in params){
        str+=`${key}=${params[key]}&`
    }
    return `${apiBase}/api${url}?${str}`
}

export const post =(url,params,data)=>{
    return new Promise((resolve,reject)=>{
        axios.post(httpUrl(url,params),data).then(res=>{
            if(res.status==200){
                resolve(res.data.data)
            }else{
                reject(res.data)
            }
        }).catch(reject)
    })
}