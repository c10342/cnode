const axios = require('axios')

const express = require('express')

const router = express.Router()

const baseUrl = 'https://cnodejs.org/api/v1'

router.post('/login',function (req,res,next) {
    axios.post(`${baseUrl}/accesstoken `,{
        accesstoken:req.body.accessToken
    }).then(result=>{
        if(result.status==200 && result.data.success){
            req.session.user={
                accessToken:req.body.accessToken,
                loginname:result.data.loginname,
                id:result.data.id,
                avatar_url:result.data.avatar_url
            }
            res.json({
                success:true,
                data:result.data
            })
        }
    }).catch(err=>{
        if(err.respond){ //业务逻辑有错误，而不是服务器出错,这是服务器还是有数据返回的
            res.json({
                success:false,
                data:err.respond.data
            })
        }else{ //抛给全局的错误处理器
            next(err)
        }
    })
})

module.exports = router