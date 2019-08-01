import request from '@/utils/request'

export function fetchDeliverList(query) {
  // console.dir(request)
  return request({
    url: '/container/tasks',
    method: 'get',
    params: query
  })
}

export function fetchDeliver(id) {
  return request({
    url: '/container/tasks/' + id,
    method: 'get',
    params: {}
  })
}

// export function fetchDeliverDetail(id) {
//   return request({
//     url: '/container/tasks/detail/' + id,
//     method: 'get',
//     params: {}
//   })
// }

export function createDeliver(data) {
  return request({
    url: '/container/tasks',
    method: 'post',
    data
  })
}

export function updateDeliver(data) {
  return request({
    url: '/container/tasks/' + data.id,
    method: 'put',
    data
  })
}

export function updateDeliverStatus(data) {
  return request({
    url: `/container/tasks/status/${data.id}`,
    method: 'put',
    data
  })
}

// 获取应用选项列表
export function fetchAppOptions(query) {
  return request({
    url: '/container/tasks/apk/list',
    method: 'get',
    params: query
  })
}

// 获取应用版本选项列表
export function fetchAppVersionOptions(id) {
  return request({
    url: '/container/tasks/apk/version/' + id,
    method: 'get'
  })
}

// 获取当前版本的应用信息
export function fetchAppInfo(id) {
  return request({
    url: '/container/tasks/apk/manufacture/' + id,
    method: 'get'
  })
}

// 获取容器配置选项列表
export function fetchContainerConfigOptions(query) {
  return request({
    url: '/container/tasks/apk/weight/',
    method: 'get',
    params: query
  })
}

// 获取集成方选项列表
export function fetchChannelOptions(query) {
  return request({
    url: '/container/tasks/apk/channel/',
    method: 'get',
    params: query
  })
}

// 获取手机品牌选项列表
export function fetchBrandOptions(query) {
  return request({
    url: '/container/tasks/apk/brand/',
    method: 'get',
    params: query
  })
}

// 获取指定手机品牌的机型选项列表
export function fetchDeviceTypeOptions(id) {
  return request({
    url: '/container/tasks/apk/brand/' + id,
    method: 'get'
  })
}
