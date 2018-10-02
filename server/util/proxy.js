const axios = require('axios')

// 可以将{age:13,name:'zhangsan'} 转换成 age=13&name=zhangsan
const queryString=require('query-string')

const baseUrl = 'https://cnodejs.org/api/v1'

module.exports = function(req,res,next){
    const path = req.path;
    const user = req.session.user || {};

    // 处理get请求过来的参数
    let query = Object.assign({},req.query)

    // 处理post参数
    let data = queryString.stringify(Object.assign({},req.body))

    axios({
        method:req.method,
        url:`${baseUrl}${path}`,
        params:query,
        data,
        // cnode的api有些可以接受application/json，有些只能接受application/x-www-form-urlencoded，所以这里统一用application/x-www-form-urlencoded
        header:{
            'Content-Type':'application/x-www-form-urlencoded'
        }
    }).then(result=>{
        if(result.status==200){
            res.json({
                data:result.data
            })
        }else{
            res.status(result.status).send(result.data)
        }
    }).catch(err=>{
        // 服务器出错
        if(err.respond){
            res.status(500).send(err.respond.data)
        }else{
            res.status(500).send({
                success:false,
                msg:'未知错误'
            })
        }
    })
}