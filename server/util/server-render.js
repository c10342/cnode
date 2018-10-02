const ReactDomSsr = require('react-dom/server.js')
const bootstrapper = require('react-async-bootstrapper')
const ejs = require('ejs')
const serialize = require('serialize-javascript')
const Helmet = require('react-helmet').default

const getStore = (stores)=>{
    return Object.keys(stores).reduce((result,storeName)=>{
        result[storeName]=stores[storeName].toJson()
        return result
    },{})
}


module.exports =(bundle,template,req,res)=>{
    if(!bundle){
        res.send('waiting for complie')
        return;
    }

    return new Promise((resolve,reject)=>{

        const serverBundle = bundle.default

        const createStore = bundle.createStore

        const routerContext={}
        const stores=createStore()

        // 判断是否已经登陆了，登录了就设置user这样下次刷新的时候就不用重新登陆了
        const user = req.session.user
        if(user){
            stores.user.userInfo=user
            stores.user.isLogin=true
            stores.user.accessToken=user.accessToken
        }
        const app = serverBundle(stores,routerContext,req.url)

        bootstrapper(app).then(()=>{
            if(routerContext.url){
                res.status(302).setHeader('Location',routerContext.url)
                res.end()
                return;
            }
            const helmet = Helmet.rewind()
            const store = getStore(stores)
            const content = ReactDomSsr.renderToString(app)
            const ejsHtml = ejs.render(template,{
                appString:content,
                initialState:serialize(store),
                meta:helmet.meta.toString(),
                title:helmet.title.toString(),
                style:helmet.style.toString(),
                link:helmet.link.toString()
            })
            res.send(ejsHtml)
            resolve(true)
        }).catch(reject)
    })
}