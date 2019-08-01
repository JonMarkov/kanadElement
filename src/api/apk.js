import request from '@/utils/request'
const OSS = require('ali-oss')

// 函数封装 请求APK管理处的列表
export function fetchApkList(query) {
  return request({
    url: '/container/apks',
    method: 'get',
    params: query
  })
}
export function fetchApk(id) {
  return request({
    url: '/container/apks/' + id,
    method: 'get',
    params: {}
  })
}

export function createApk(data) {
  return request({
    url: '/container/apks',
    method: 'post',
    data
  })
}

export function updateApk(data) {
  return request({
    url: '/container/apks/' + data.id,
    method: 'put',
    data
  })
}
// 查询内容方列表
export function fetchmanufacturersApk(query) {
  return request({
    url: '/container/weights/manufacture/list/',
    method: 'get',
    params: query
  })
}
// 请求oss所需参数
export function ossRqu(query) {
  return request({
    url: '/container/apks/oss/token',
    method: 'get',
    params: query
  })
}
// 请求oss所需参数
export function lableList(query) {
  return request({
    url: '/container/apks/tag/list',
    method: 'get',
    params: query
  })
}

export function client(data) {
  return new OSS({
    region: 'cn-hangzhou',
    accessKeyId: data.accessKeyId,
    accessKeySecret: data.accessKeySecret,
    stsToken: data.securityToken,
    bucket: data.bucket,
    endpoint: 'oss-cn-hangzhou.aliyuncs.com'
  })
}
