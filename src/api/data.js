import request from '@/utils/request'

// 函数封装 请求数据-投放数据的列表
export function fetchDataDeliverList(query) {
  return request({
    url: '/container/statistics/task/dates',
    method: 'get',
    params: query
  })
}
// 函数封装 请求数据-投放数据的列表
export function fetchDataDeliverOld(id) {
  return request({
    url: '/container/statistics/task/dates/' + id,
    method: 'get',
    params: {}
  })
}
// 函数封装 请求数据-用户数据的列表
export function fetchUserDeliverList(query) {
  return request({
    url: '/container/statistics/user/dates',
    method: 'get',
    params: query
  })
}
// 函数封装 请求数据-用户数据的列表
export function fetchUserDeliverOld(id) {
  return request({
    url: '/container/statistics/user/dates/' + id,
    method: 'get',
    params: {}
  })
}
