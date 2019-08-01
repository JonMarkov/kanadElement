import Mock from 'mockjs'
import loginAPI from './login'

import deliverAPI from './deliver'
import accountAPI from './account'
import manufacturerAPI from './manufacturer'
import channelAPI from './channel'
import containerAPI from './container'
import uploadAPI from './upload'

// 修复在使用 MockJS 情况下，设置 withCredentials = true，且未被拦截的跨域请求丢失 Cookies 的问题
// https://github.com/nuysoft/Mock/issues/300
Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
Mock.XHR.prototype.send = function() {
  if (this.custom.xhr) {
    this.custom.xhr.withCredentials = this.withCredentials || false
  }
  this.proxy_send(...arguments)
}

// Mock.setup({
//   timeout: '350-600'
// })

// 登录相关
Mock.mock(/\/auth\/token/, 'post', loginAPI.loginByUsername)
Mock.mock(/\/login\/logout/, 'post', loginAPI.logout)
// 账户相关
Mock.mock(/\/users\/(\d)+/, 'get', loginAPI.getUserInfo)
Mock.mock(/\/users/, 'post', accountAPI.createAccount)
Mock.mock(/\/users\/(\d)+/, 'put', accountAPI.updateAccount)
Mock.mock(/\/users/, 'get', accountAPI.getAccountList)

// 投放任务相关
Mock.mock(/\/container\/tasks/, 'post', deliverAPI.createDeliver)
Mock.mock(/\/container\/tasks\/(\d)+$/, 'put', deliverAPI.updateDeliver)
Mock.mock(/\/container\/tasks\/(\d)+/, 'get', deliverAPI.getDeliver)
Mock.mock(/\/container\/tasks\/detail\/(\d)+/, 'get', deliverAPI.getDeliverDetail)
Mock.mock(/\/container\/tasks[?].+/, 'get', deliverAPI.getDeliverList)
Mock.mock(/\/container\/tasks\/(\d)+\/review/, 'put', deliverAPI.updateStatus)
Mock.mock(/\/container\/tasks\/apk[?].+/, 'get', deliverAPI.getAppList)
Mock.mock(/\/container\/tasks\/apk\/version\/(\d)+/, 'get', deliverAPI.getAppVersionList)
Mock.mock(/\/container\/tasks\/apk\/manufacture\/(\d)+/, 'get', deliverAPI.getAppInfo)

// 内容方相关
Mock.mock(/\/container\/manufacturers\/(\d)+/, 'get', manufacturerAPI.getManufacturer)
Mock.mock(/\/container\/manufacturers/, 'post', manufacturerAPI.createManufacturer)
Mock.mock(/\/container\/manufacturers\/(\d)+/, 'put', manufacturerAPI.updateManufacturer)
Mock.mock(/\/container\/manufacturers/, 'get', manufacturerAPI.getManufacturerList)

// 集成方相关
Mock.mock(/\/container\/channels\/(\d)+/, 'get', channelAPI.getChannel)
Mock.mock(/\/container\/channels/, 'post', channelAPI.createChannel)
Mock.mock(/\/container\/channels\/(\d)+/, 'put', channelAPI.updateChannel)
Mock.mock(/\/container\/channels/, 'get', channelAPI.getChannelList)

// 容器配置相关
Mock.mock(/\/container\/weights\/(\d)+/, 'get', containerAPI.getContainerConfig)
Mock.mock(/\/container\/weights/, 'post', containerAPI.createContainerConfig)
Mock.mock(/\/container\/weights\/(\d)+/, 'put', containerAPI.updateContainerConfig)
Mock.mock(/\/container\/weights[?].+/, 'get', containerAPI.getContainerConfigList)
Mock.mock(/\/container\/weights\/manufacture\/list/, 'get', containerAPI.getManufacturerOptions)

Mock.mock(/\/file/, 'post', uploadAPI.upload)

export default Mock
