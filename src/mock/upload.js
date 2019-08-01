export default {
  upload(config) {
    // const fileObj = config.body.get('file')
    // const reader = new FileReader()
    // reader.readAsDataURL(fileObj)
    // const url = await new Promise((resolve, reject) => {
    //   reader.onload = function(e) {
    //     resolve(e.target.result)
    //   }
    // })
    const ruls = [
      'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80',
      'https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=59125745,2894869156&fm=58',
      'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=4135213963,1816457489&fm=58'
    ]
    return {
      code: 0,
      data: {
        url: ruls[Math.floor(Math.random() * (ruls.length + 1))]
      }
    }
  }
}
