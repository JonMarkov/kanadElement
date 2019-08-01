import request from '@/utils/request'

export function fetchContainerConfigList(query) {
  // console.dir(request)
  return request({
    url: '/container/weights',
    method: 'get',
    params: query
  })
}

export function fetchContainerConfig(id) {
  return request({
    url: '/container/weights/' + id,
    method: 'get',
    params: {}
  })
}

export function createContainerConfig(data) {
  return request({
    url: '/container/weights',
    method: 'post',
    data
  })
}

export function updateContainerConfig(data) {
  return request({
    url: '/container/weights/' + data.id,
    method: 'put',
    data
  })
}

export function fetchManufacturerOptions(query) {
  // console.dir(request)
  return request({
    url: '/container/weights/manufacture/list/',
    method: 'get',
    params: query
  })
}
