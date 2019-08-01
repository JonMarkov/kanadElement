import request from '@/utils/request'

export function fetchAccountList(query) {
  // console.dir(request)
  return request({
    url: '/users',
    method: 'get',
    params: query
  })
}

export function fetchAccount(id) {
  return request({
    url: '/users/' + id,
    method: 'get',
    params: {}
  })
}

export function createAccount(data) {
  return request({
    url: '/users',
    method: 'post',
    data
  })
}

export function updateAccount(data) {
  return request({
    url: '/users/' + data.id,
    method: 'put',
    data
  })
}
