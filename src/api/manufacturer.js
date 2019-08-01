import request from '@/utils/request'

export function fetchManufacturerList(query) {
  // console.dir(request)
  return request({
    url: '/container/manufacturers',
    method: 'get',
    params: query
  })
}

export function fetchManufacturer(id) {
  return request({
    url: '/container/manufacturers/' + id,
    method: 'get',
    params: {}
  })
}

export function createManufacturer(data) {
  return request({
    url: '/container/manufacturers',
    method: 'post',
    data
  })
}

export function updateManufacturer(data) {
  return request({
    url: '/container/manufacturers/' + data.id,
    method: 'put',
    data
  })
}
