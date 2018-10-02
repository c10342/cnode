const qiniu = require('qiniu')
const fs = require('fs')
const path = require('path')

const cdnConfig = require('../app.config').cdn

// 不需要上传的文件
const noNeedUploadFileList = ['index.html', 'server-template.ejs', 'server-entry.js']

const {
  ak, sk, bucket,
} = cdnConfig

const mac = new qiniu.auth.digest.Mac(ak, sk)

const config = new qiniu.conf.Config()

// 存储空间的区域，即新建存储空间时所选的区域
// 华东	qiniu.zone.Zone_z0
// 华北	qiniu.zone.Zone_z1
// 华南	qiniu.zone.Zone_z2
// 北美	qiniu.zone.Zone_na0
config.zone = qiniu.zone.Zone_z0

const doUpload = (key, file) => {
  const options = {
      // scope是指要上传到那个bucket，即存储空间的名称，加上key是因为上传同名文件时需要覆盖掉，不加就不覆盖掉
    scope: bucket + ':' + key,
  }
  const formUploader = new qiniu.form_up.FormUploader(config)
  const putExtra = new qiniu.form_up.PutExtra()
  const putPolicy = new qiniu.rs.PutPolicy(options)
  const uploadToken = putPolicy.uploadToken(mac)
  return new Promise((resolve, reject) => {
    formUploader.putFile(uploadToken, key, file, putExtra, (err, body, info) => {
      if (err) {
        return reject(err)
      }
      if (info.statusCode === 200) {
        resolve(body)
      } else {
        reject(body)
      }
    })
  })
}

const files = fs.readdirSync(path.join(__dirname, '../dist'))
const uploads = files.map(file => {
    // 判断是否是需要上传的文件
  if (noNeedUploadFileList.indexOf(file) === -1) {
    return doUpload(
      file,
      path.join(__dirname, '../dist', file)
    )
  } else {
    return Promise.resolve('no need upload file ' + file)
  }
})
Promise.all(uploads).then(resps => {
  console.log('upload success:', resps)
}).catch(errs => {
  console.log('upload fail:', errs)
    // 结束进程
  // process.exit(0)
})
