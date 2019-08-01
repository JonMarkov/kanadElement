import request from '@/utils/request'

export function loginByUsername(username, password) {
  return request({
    url: '/auth/token',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo(id) {
  return request({
    url: `/users/${id}`,
    method: 'get'
  })
}

