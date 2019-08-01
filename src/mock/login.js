// import { param2Obj } from '@/utils'

const userMap = {
  admin: {
    roles: ['admin'],
    api_token: 'admin',
    introduction: '我是超级管理员',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    username: 'Super Admin',
    realname: 'Super Admin'
  },
  editor: {
    roles: ['editor'],
    api_token: 'editor',
    introduction: '我是编辑',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    username: 'Normal Editor',
    realname: 'Normal Editor'
  }
}

export default {
  loginByUsername: config => {
    const { username } = JSON.parse(config.body)
    // console.log(username)
    return {
      code: 0,
      data: userMap[username]
    }
  },
  getUserInfo: config => {
    // const { token } = param2Obj(config.url)
    // if (userMap[token]) {
    //   return userMap[token]
    // } else {
    //   return false
    // }
    return userMap.admin
  },
  logout: () => 'success'
}
