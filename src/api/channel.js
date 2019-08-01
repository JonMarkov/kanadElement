import request from '@/utils/request'

// 函数封装 请求管理-渠道管理的列表
export function fetchChannelsList(query) {
  return request({
    url: '/container/channels',
    method: 'get',
    params: query
  })
}
// 函数封装 查询渠道信息
export function fetchChannel(id) {
  return request({
    url: '/container/channels/' + id,
    method: 'get',
    params: {}
  })
}
// 函数封装 新增提交渠道
export function createChannel(data) {
  return request({
    url: '/container/channels',
    method: 'post',
    data
  })
}
// 函数封装 修改渠道
export function updateChannel(data) {
  return request({
    url: '/container/channels/' + data.id,
    method: 'put',
    data
  })
}

